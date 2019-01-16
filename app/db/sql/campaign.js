const knex = require('../../db/connect')

async function add({ name, descr, departmentId }) {
  return (await knex
    .returning('*')
    .insert([{ name, descr, departmentId }])
    .into('core.campaign'))[0]
}

async function addRevision({ campaignId, descr, parentRevId = null }) {
  return (await knex
    .returning('campaignRevId')
    .insert([{ campaignId, descr, parentRevId }])
    .into('core.campaignRev'))[0]
}

async function getCampaigns() {
  const column = [
    'campaign.campaignId',
    'campaign.name'
  ];
  return knex.select(column)
    .from('core.campaign')
}

module.exports = { add, addRevision, getCampaigns }
