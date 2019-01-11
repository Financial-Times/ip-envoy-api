import trackRevSQL from '../db/sql/trackRev'

//const trackRevDeploy = require('./trackRevDeploy');
//const dbBuilder = trackRevDeploy.dbBuilder;

async function getById(trackRevId) {
  return trackRevSQL.getById(trackRevId)
}

async function getTrackList() {
  return trackRevSQL.listTrack()
}

async function saveTrack(trackId, GUIData) {
  return trackRevSQL.saveTrack(trackId, GUIData)
}

async function updateTrackName(trackId, name) {
  await trackRevSQL.updateTrackName(trackId, name)
}

async function updateTrackRemoveDate(date, table, column, trackId) {
  await trackRevSQL.updateTrackRemoveDate(date, table, column, trackId)
}

// async function deployTrack(GUIData) {
//   const siloTypes = await trackRevDeploy.getSiloTypes();
//   const chartNodeRegistry = {};
//   const chartNodeByChartId = {};

//   const campaignRevId = 1; // WARNING TODO: hardwired variable
//   const trackRevId = await dbBuilder.haveTrack({
//     name: 'GUI Deploy Test', // WARNING TODO: hardwired variable
//     descr: 'Test',
//     entityTypeName: 'user', // hardwired to entityType Users for now
//     voltQuery: '' // hardwired for now, the GUI could set this
//   }, campaignRevId);

//   GUIData.nodes.forEach((node) => {
//     if ((node.name) in chartNodeRegistry) {
//       chartNodeRegistry[node.name].push(node);
//     } else {
//       chartNodeRegistry[node.name] = Array(node);
//     }
//     chartNodeByChartId[node.id] = node;
//   });

//   // Look for all chart nodes that have a silo name and add them to the db
//   // and decorate the extras object with newly created siloId
//   await Promise.all(Object.keys(siloTypes.byName)
//     .filter((siloName) => {
//       return chartNodeRegistry[siloName];
//     }).map(async (siloName) => { // , index
//       chartNodeRegistry[siloName] = await Promise.all(chartNodeRegistry[siloName]
//         .map(async (silo) => {
//           silo.extras.siloTypeId = siloTypes.byName[silo.name];
//           silo.extras.siloId = await dbBuilder.haveSilo(silo.extras, trackRevId);
//           return silo;
//         }));
//     }));

//   // Rulesets - connect silos together:
//   chartNodeRegistry['Rule Set'] = await Promise.all(chartNodeRegistry['Rule Set'].map(async (ruleSet) => {
//     const ruleSetId = await dbBuilder.haveRuleSet(ruleSet.extras);
//     ruleSet.extras.ruleSetId = ruleSetId;
//     const targetLink = GUIData.links.find((link) => (link.source === ruleSet.id));
//     GUIData.links.filter((link) => ( // Find all links pointing to ruleset:
//       (chartNodeByChartId[link.target].extras.ruleSetId || null) === ruleSetId)
//     ).forEach((sourceLink) => dbBuilder.addStep(
//       chartNodeByChartId[sourceLink.source].extras.siloId,
//       ruleSetId,
//       chartNodeByChartId[targetLink.target].extras.siloId
//     ));
//     return ruleSet;
//   }));

//   // Setup channels
//   GUIData.links.filter((link) => (chartNodeByChartId[link.target].name === 'Channel'))
//     .forEach((channelLink) => {
//       dbBuilder.addChannelToSilo(chartNodeByChartId[channelLink.source].extras.siloId, {
//         id: chartNodeByChartId[channelLink.target].extras.channelId,
//         config: chartNodeByChartId[channelLink.target].extras.data
//       });
//     });

//   return true;
// }

export default {
  getById,
  saveTrack,
  //deployTrack,
  updateTrackName,
  getTrackList,
  updateTrackRemoveDate
}
