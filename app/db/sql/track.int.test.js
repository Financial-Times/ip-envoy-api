const trackSQL = require('./track');
const campaignSQL = require('./campaign');
const departmentSQL = require('./department');
const entitySQL = require('./entity');
const { truncateDB } = require('../../testHelpers.js');

describe('Track SQL', () => {
  const entityType = 'user';
  let campaignRevId;

  beforeEach(async () => {
    await truncateDB();
    await entitySQL.addEntityType(entityType);
    await trackSQL.addTrackStatus({ trackStatusId: 2, name: 'active' });
    await trackSQL.addTrackStatus({ trackStatusId: 3, name: 'inactive' });
    const department = await departmentSQL.add({ name: 'test', descr: 'test' });
    const campaign = await campaignSQL.add(
      { name: 'test', deccr: 'test', departmentId: department.departmentId }
    );
    campaignRevId = (await campaignSQL.addRevision(
      { campaignId: campaign.campaignId, descr: 'test' })
    );
  });

  it('creates a track with default status of 2', async () => {
    const trackToAdd = {
      name: 'test',
      descr: 'test',
      entityTypeName: entityType,
      campaignRevId
    };
    const track = await trackSQL.add(trackToAdd);
    expect(track.trackStatusId).toBe(2);
    expect(track.name).toBe(trackToAdd.name);
  });

  it('updates track status', async () => {
    const trackToAdd = {
      name: 'test',
      descr: 'test',
      entityTypeName: entityType,
      campaignRevId
    };
    const newStatus = 3;
    const track = await trackSQL.add(trackToAdd);
    const updatedTrack = await trackSQL.setState(track.trackId, 3);
    expect(updatedTrack.trackStatusId).toBe(newStatus);
  });

  it('adds a track revision', async () => {
    const trackToAdd = {
      name: 'test',
      descr: 'test',
      entityTypeName: entityType,
      campaignRevId
    };
    const track = await trackSQL.add(trackToAdd);
    const trackRev = await trackSQL.addTrackRev(track.trackId);
    expect(trackRev.trackId).toBe(track.trackId);
  });
});
