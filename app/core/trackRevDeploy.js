const { logger } = require('../logger');
const knexConnection = require('../db/connect');
const { promisify } = require('util');

const knexConnectionAsync = promisify(knexConnection);

module.exports = {
  siloTypes: { // used for quick lookups
    byName: {},
    byId: {}
  },
  getSiloTypes: async function () { // eslint-disable-line object-shorthand
    const res = await knexConnectionAsync.select('*').from('core.siloType');
    res.forEach((siloType) => {
      this.siloTypes.byName[siloType.name] = siloType.siloTypeId;
      this.siloTypes.byId[siloType.siloTypeId] = siloType;
    });
    return this.siloTypes;
  },

  dbBuilder: {
    setCurrentTrackRev: async function (trackId, trackRevId) { // eslint-disable-line object-shorthand, max-len
      try {
        await knexConnectionAsync.raw(`
          UPDATE core."track" SET
          "currentTrackRevId" = ?
          WHERE track."trackId" = ?
          `, [trackRevId, trackId]);
      } catch (e) {
        logger.error(e);
      }
      return true;
    },
    haveDepartment: async function (department) { // eslint-disable-line object-shorthand
      const res = await knexConnectionAsync.select('*').from('core.department').where({
        name: department.name
      });
      if (res.length) { // record exists, so return id
        return res[0].departmentId;
      }
      return (await knexConnectionAsync.insert([{ // create new and return new id
        name: department.name,
        descr: department.descr
      }], 'departmentId').into('core.department'))[0];
    },
    haveTrack: async function (track, campaignRevId) { // eslint-disable-line object-shorthand
      const res1 = await knexConnectionAsync.select('*').from('core.track').where({
        name: track.name
      });
      let dbTrackId;
      if (res1.length) { // record exists, so return id
        dbTrackId = res1[0].trackId;
      } else {
        dbTrackId = (await knexConnectionAsync.insert([{
          name: track.name,
          descr: track.descr,
          entityTypeName: track.entityTypeName,
          campaignRevId
        }], 'trackId').into('core.track'))[0];
      }
      const res2 = await knexConnectionAsync.raw(`
        SELECT MAX("trackRevId") FROM core."trackRev" WHERE "trackId" = '${dbTrackId}'
      `);
      const trackRevId = (await knexConnectionAsync.insert([{
        trackId: dbTrackId,
        parentTrackRevId: ((res2.length) ? res2[0].trackRevId : null),
        descr: 'auto generated track revision by Lucid importer',
        voltQuery: track.voltQuery
      }], 'trackRevId').into('core.trackRev'))[0];
      await this.setCurrentTrackRev(dbTrackId, trackRevId);
      return trackRevId;
    },
    haveRuleSet: async function (ruleSet) { // eslint-disable-line object-shorthand
      // takes ruleSet, adds if not exists, always returns id
      const res = await knexConnectionAsync.select('*').from('core.ruleSet').where({
        name: ruleSet.name
      });
      if (res.length) { // record exists, so return id
        return res[0].ruleSetId;
      }
      return (await knexConnectionAsync.insert([{ // create new and return new id
        name: ruleSet.name,
        descr: ruleSet.descr,
        ruleData: ruleSet.metaData
      }], 'ruleSetId').into('core.ruleSet'))[0];
    },
    haveSilo: async function (silo, trackRevId) { // eslint-disable-line object-shorthand
      return (await knexConnectionAsync.insert([{
        name: silo.name,
        descr: silo.description,
        trackRevId,
        siloTypeId: silo.siloTypeId
      }], 'siloId').into('core.silo'))[0];
    },
    addStep: async function (currentSiloId, ruleSetId, onPassSiloId) { // eslint-disable-line object-shorthand, max-len
      await knexConnectionAsync.insert([{
        currentSiloId,
        ruleSetId,
        onPassSiloId
      }], 'stepId').into('core.step');
    },
    addChannelToSilo: async function (siloId, channel) { // eslint-disable-line object-shorthand, max-len
      await knexConnectionAsync.insert([{
        channelId: channel.id,
        siloId,
        config: channel.config
      }]).into('core.channel_silo');
    }
  }
};

// test
