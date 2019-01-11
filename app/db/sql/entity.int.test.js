const { entitySQL, trackSQL } = require('./');
const { truncateDB, seedSilo, seedAll } = require('../../testHelpers.js');
const knex = require('../../db/connect');

describe('Entity SQL', () => {
  beforeEach(async () => {
    await truncateDB();
  });

  const entityToAdd = {
    entityId: '7f1c3853-71f8-4117-b9b3-1dde98b0660f',
    entityTypeName: 'user'
  };

  it('Creates new entity type', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entityType');
    expect(entitiesInitial).toHaveLength(0);
    const entityTypeName = 'user';
    const createdEntityType = await entitySQL.addEntityType(entityTypeName);
    expect(createdEntityType.name).toEqual(entityTypeName);
  });

  it('Creates new entity of an existing type', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entity');
    expect(entitiesInitial).toHaveLength(0);
    const { entityId, entityTypeName } = entityToAdd;
    await entitySQL.addEntityType(entityTypeName);
    const entitiesFinal = await entitySQL.add(entityId, entityTypeName);
    expect(entitiesFinal.entityId).toEqual(entityToAdd.entityId);
  });

  it('Does not error if entityId already exists', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entity');
    expect(entitiesInitial).toHaveLength(0);
    const { entityId, entityTypeName } = entityToAdd;
    await entitySQL.addEntityType(entityTypeName);
    const entitiesFinal = await entitySQL.add(entityId, entityTypeName);
    await entitySQL.add(entityId, entityTypeName);
    expect(entitiesFinal.entityId).toEqual(entityToAdd.entityId);
  });

  it('Fails to create entity if type doesn\'t exist', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entity');
    expect(entitiesInitial).toHaveLength(0);
    const { entityId, entityTypeName } = entityToAdd;
    let entitiesFinal;
    try {
      entitiesFinal = await entitySQL.add(entityId, entityTypeName);
    } catch (err) {
      expect(err).toBeDefined();
      expect(entitiesFinal).not.toBeDefined();
    }
  });

  it('Fails to create entity if entityId is not a valid uuid', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entity');
    expect(entitiesInitial).toHaveLength(0);
    const entityId = 'notvalid';
    const { entityTypeName } = entityToAdd;
    await entitySQL.addEntityType(entityTypeName);
    let entitiesFinal;
    try {
      entitiesFinal = await entitySQL.add(entityId, entityTypeName);
    } catch (err) {
      expect(err).toBeDefined();
      expect(entitiesFinal).not.toBeDefined();
    }
  });

  it('Bulk creates new entity of an existing type', async () => {
    const entitiesInitial = await knex
      .select('*')
      .from('core.entity');
    expect(entitiesInitial).toHaveLength(0);
    const entities = [
      entityToAdd, Object.assign({}, entityToAdd, { entityId: '48587380-ae87-4f76-aadb-b64b69abb7ce' })
    ];
    const { entityTypeName } = entityToAdd;
    await entitySQL.addEntityType(entityTypeName);
    const entitiesFinal = await entitySQL.addBulk(entities);
    expect(entitiesFinal.length).toBe(2);
  });

  it('gets an entity', async () => {
    const { entityId, entityTypeName } = entityToAdd;
    await entitySQL.addEntityType(entityTypeName);
    await entitySQL.add(entityId, entityTypeName);
    return expect((await entitySQL.get(entityId)).entityId).toEqual(entityId);
  });

  it('moves an entity to a source silo', async () => {
    const { entity, silo } = await seedAll();
    const entityCount = await entitySQL.placeInSourceSilo(
      [entity.entityId], entity.entityTypeName, silo.siloId
    );
    expect(entityCount).toBe(1);
  });

  it('moves an entity to a from one silo to another', async () => {
    const { entity, silo, track } = await seedAll();
    const targetSilo = await seedSilo(track.trackRevId);
    await entitySQL.placeInSourceSilo(
      [entity.entityId], entity.entityTypeName, silo.siloId
    );
    const successfulMoves = await entitySQL.moveToSilo(
      [entity.entityId], entity.entityTypeName, targetSilo.siloId, silo.siloId
    );
    expect(successfulMoves).toBe(1);
  });


  it('gets an entity\'s tracks', async () => {
    const { entity, silo, track } = await seedAll();
    await entitySQL.placeInSourceSilo(
      [entity.entityId], entity.entityTypeName, silo.siloId
    );
    const tracks = await entitySQL.getTracks(entity.entityId, [2]);
    expect(tracks[0].trackId).toBe(track.trackId);
  });

  it('gets an entity\'s tracks filtered by status', async () => {
    const { entity, silo, track } = await seedAll();
    await entitySQL.placeInSourceSilo(
      [entity.entityId], entity.entityTypeName, silo.siloId
    );
    const emptyTracks = await entitySQL.getTracks(entity.entityId, [3]);
    expect(emptyTracks.length).toBe(0);
    await trackSQL.setState(track.trackId, 3);
    const tracks = await entitySQL.getTracks(entity.entityId, [3]);
    expect(tracks.length).toBe(1);
  });
});
