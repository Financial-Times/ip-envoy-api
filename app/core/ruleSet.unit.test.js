const mockRuleSetSQL = {};
const mockVolt = {};
const mockRulesEngine = {};

function restoreMocks() {
  let scheduledRes = Promise.resolve('success');
  let rulesEngineRes = [{ event: 1 }];
  // RuleSetSQL
  mockRuleSetSQL.getBySilo = jest.fn((id) => {
    return id ? Promise.resolve('ok') : Promise.reject('problem');
  });
  mockRuleSetSQL.getAllScheduled = jest.fn(() => scheduledRes);
  mockRuleSetSQL.setScheduledRes = (res) => { scheduledRes = res; };

  // Volt
  mockVolt.get = () => ({ uuid: '123' });

  // Rules Engine
  mockRulesEngine.engines = {
    1: {
      run: jest.fn(() => rulesEngineRes)
    }
  };
  mockRulesEngine.setRulesEngineRes = (res) => { rulesEngineRes = res; };
}

jest.mock('../db/sql/ruleSet', () => {
  return mockRuleSetSQL;
});
jest.mock('./volt', () => {
  return mockVolt;
});
jest.mock('../rulesEngine', () => {
  return mockRulesEngine;
});

const ruleSet = require('./ruleSet');
const rulesEngine = require('../rulesEngine');
const volt = require('./volt');

describe('Rule Set Core', () => {
  beforeEach(() => {
    restoreMocks();
  });

  it('returns non volt-enriched entities passed by ruleSet', async () => {
    const entity = { entityId: '123', entityTypeName: 'user' };
    const res = await ruleSet.runRuleSet({ stepId: 1 }, [entity]);
    expect(res.entityIds).toContain(entity.entityId);
    expect(res.entities[entity.entityId].entityId).toBe(entity.entityId);
    expect(res.entityTypeName).toBe(entity.entityTypeName);
    expect(res.entities[entity.entityId].getUserPreferences).not.toBeDefined();
  });

  it('returns volt-enriched entities passed by ruleSet', async () => {
    const entity = { entityId: '123', entityTypeName: 'user' };
    const voltQuery = 'getUserPreferences';
    const res = await ruleSet.runRuleSet({ stepId: 1, voltQuery }, [entity]);
    const voltRes = volt.get();
    expect(res.entityIds).toContain(entity.entityId);
    expect(res.entities[entity.entityId].entityId).toBe(entity.entityId);
    expect(res.entityTypeName).toBe(entity.entityTypeName);
    expect(Object.keys(voltRes).every((vr) => {
      return Object.keys(res.entities[entity.entityId].getUserPreferences).includes(vr);
    })).toBeTruthy();
  });

  it('Does not return entities if no rules pass', async () => {
    rulesEngine.setRulesEngineRes([]);
    const entity = { entityId: 123, entityTypeName: 'user' };
    const res = await ruleSet.runRuleSet({ stepId: 1 }, [entity]);
    expect(res).toBe(null);
  });

  it('Returns passing entities with a mode of pass', async () => {
    const entity = { entityId: '123', entityTypeName: 'user' };
    const res = await ruleSet.runRuleSet({ stepId: 1, onPassSiloId: 9 }, [entity]);
    expect(res.entityIds).toContain(entity.entityId);
    expect(res.entities[entity.entityId].mode).toBe('pass');
  });

  it('Returns failing entities when an onFailSiloId has been passed', async () => {
    rulesEngine.setRulesEngineRes([]);
    const entity = { entityId: '123', entityTypeName: 'user' };
    const res = await ruleSet.runRuleSet({ stepId: 1, onFailSiloId: 8 }, [entity]);
    expect(res.entityIds).toContain(entity.entityId);
    expect(res.entities[entity.entityId].mode).toBe('fail');
  });

  it('Returns passing and failing entities', async () => {
    rulesEngine.engines['1'].run.mockImplementation((req) => {
      if (req.entityData.entityId === '123') {
        return [];
      }

      return [{ event: 1 }];
    });
    const entity = { entityId: '123', entityTypeName: 'user' };
    const entity2 = { entityId: '456', entityTypeName: 'user' };
    const res = await ruleSet.runRuleSet({ stepId: 1, onPassSiloId: 5, onFailSiloId: 8 }, [entity, entity2]);
    expect(res.entityIds).toContain(entity.entityId);
    expect(res.entityIds).toContain(entity2.entityId);
    expect(res.entities[entity.entityId].mode).toBe('fail');
    expect(res.entities[entity2.entityId].mode).toBe('pass');
  });
});
