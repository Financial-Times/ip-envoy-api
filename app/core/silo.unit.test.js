const mockSiloSQL = {};

function restoreMocks() {
  mockSiloSQL.getRes = Promise.resolve([{ entityId: 1 }]);
  mockSiloSQL.getEntitiesBySilo = jest.fn(() => mockSiloSQL.getRes);
  mockSiloSQL.setGetRes = (res) => { mockSiloSQL.getRes = res; };
}

jest.mock('../db/sql/silo', () => {
  return mockSiloSQL;
});

const silo = require('./silo');

describe('Silo Core', () => {
  beforeEach(() => {
    restoreMocks();
    jest.clearAllMocks();
  });

  it('gets entities by a given siloId', async () => {
    const expected = await mockSiloSQL.getEntitiesBySilo(123);
    return expect(silo.getEntitiesBySilo('123')).resolves.toEqual(expected);
  });

  it('errors if can\'t get entities by siloId', async () => {
    mockSiloSQL.setGetRes(Promise.reject('problem'));
    return expect(silo.getEntitiesBySilo('123')).rejects.toBeDefined();
  });
});
