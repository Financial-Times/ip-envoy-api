const mockVoltSvc = {};

function restoreMocks() {
  mockVoltSvc.getRes = Promise.resolve({ uuid: 1, test: 'true' });
  mockVoltSvc.fetch = jest.fn(() => mockVoltSvc.getRes);
}

jest.mock('../rulesEngine/data', () => {
  return mockVoltSvc;
});

const volt = require('./volt');
const voltSvc = require('../rulesEngine/data');

describe('Volt Core', () => {
  beforeEach(() => {
    restoreMocks();
    jest.clearAllMocks();
  });

  it('gets volt data with given procName and entityId', async () => {
    const entityId = 123;
    const procName = 'testProc';
    const expected = await voltSvc.fetch(procName, entityId);
    await expect(volt.get(entityId, procName)).resolves.toEqual(expected);
    expect(voltSvc.fetch).toHaveBeenCalledWith(procName, entityId);
  });

  it('errors if can\'t get entities by siloId', async () => {
    const error = 'problem';
    voltSvc.fetch = () => Promise.reject(error);
    return expect(volt.get()).rejects.toBe(error);
  });
});
