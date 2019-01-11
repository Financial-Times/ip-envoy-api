const mockStepSQL = {};

function restoreMocks() {
  let scheduledRes = Promise.resolve('success');
  // RuleSetSQL
  mockStepSQL.getBySilo = jest.fn((id) => {
    return id ? Promise.resolve('ok') : Promise.reject('problem');
  });
  mockStepSQL.getAllScheduled = jest.fn(() => scheduledRes);
  mockStepSQL.setScheduledRes = (res) => { scheduledRes = res; };
}

jest.mock('../db/sql/step', () => {
  return mockStepSQL;
});

const step = require('./step');
const stepSQL = require('../db/sql/step');

describe('Step Core', () => {
  beforeEach(() => {
    restoreMocks();
  });

  it('gets steps linked to a silo', () => {
    return expect(step.getStepsBySilo('123')).resolves.toBeDefined();
  });

  it('fails if cant get steps by silo', () => {
    return expect(step.getStepsBySilo()).rejects.toBeDefined();
  });

  it('gets all scheduled steps', () => {
    return expect(step.getAllScheduled()).resolves.toBeDefined();
  });

  it('fails if cant get scheduled steps', () => {
    stepSQL.setScheduledRes(Promise.reject('problem'));
    return expect(step.getAllScheduled()).rejects.toBeDefined();
  });
});
