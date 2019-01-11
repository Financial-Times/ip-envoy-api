const campaignSQL = require('../db/sql/campaign');

async function getCampaign() {
  return campaignSQL.getCampaigns();
}

module.exports = { getCampaign };
