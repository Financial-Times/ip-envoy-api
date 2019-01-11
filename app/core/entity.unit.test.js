jest.mock('../db/sql/entity', () => {
  let getRes = [{ entityId: 1 }];
  return {
    add: jest.fn((id) => { return id ? Promise.resolve('ok') : Promise.reject('problem'); }),
    update: jest.fn((id) => { return id ? Promise.resolve('ok') : Promise.reject('problem'); }),
    get: (id) => { return id ? Promise.resolve(getRes) : Promise.reject('problem'); },
    setGetRes: (res) => { getRes = res; },
    moveBatchToSilo: jest.fn(),
    placeInSourceSilo: jest.fn()
  };
});

const entity = require('./entity');
const entitySQL = require('../db/sql/entity');

describe('Entity Core', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an entity', () => {
    return expect(entity.have('validId')).resolves.toBeDefined();
  });

  it('fails to create entity if invalid data provided', () => {
    return expect(entity.have()).rejects.toBeDefined();
  });

  it('gets an entity', () => {
    return expect(entity.get('validId')).resolves.toBeDefined();
  });

  it('fails to get entity if invalid data provided', () => {
    return expect(entity.get()).rejects.toBeDefined();
  });

  it('Moves passing entities from one silo to another', async () => {
    const moveDetails = [{
      entityIds: ['123'],
      entities: {
        123: {
          entityId: '123',
          mode: 'pass'
        }
      },
      entityTypeName: 'user',
      onPassSiloId: 2,
      onFailSiloId: 3,
      currentSiloId: 1,
      stepId: 5
    }];

    await entity.moveBatchToSilo(moveDetails);
    expect(entitySQL.moveBatchToSilo).toHaveBeenCalled();
    expect(entitySQL.moveBatchToSilo.mock.calls[0][0]['1'].user.pass['2'].entities).toContain('123');
  });

  it('Moves failing entities from one silo to another', async () => {
    const moveDetails = [{
      entityIds: ['123'],
      entities: {
        123: {
          entityId: '123',
          mode: 'fail'
        }
      },
      entityTypeName: 'user',
      onPassSiloId: 2,
      onFailSiloId: 3,
      currentSiloId: 1,
      stepId: 5
    }];

    await entity.moveBatchToSilo(moveDetails);
    expect(entitySQL.moveBatchToSilo).toHaveBeenCalled();
    expect(entitySQL.moveBatchToSilo.mock.calls[0][0]['1'].user.fail['3'].entities).toContain('123');
  });

  it('Moves batches containing both passing and failing entities from one silo to another', async () => {
    const moveDetails = [{
      entityIds: ['123', '456'],
      entities: {
        123: {
          entityId: '123',
          mode: 'pass'
        },
        456: {
          entityId: '456',
          mode: 'fail'
        }
      },
      entityTypeName: 'user',
      onPassSiloId: 2,
      onFailSiloId: 3,
      currentSiloId: 1,
      stepId: 5
    }];

    await entity.moveBatchToSilo(moveDetails);
    expect(entitySQL.moveBatchToSilo).toHaveBeenCalled();
    expect(entitySQL.moveBatchToSilo.mock.calls[0][0]['1'].user.pass['2'].entities).toContain('123');
    expect(entitySQL.moveBatchToSilo.mock.calls[0][0]['1'].user.fail['3'].entities).toContain('456');
  });
});
