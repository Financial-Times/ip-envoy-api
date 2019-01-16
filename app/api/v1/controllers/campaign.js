const core = require('../core')
const logger = require('../logger')

async function campaign(req, res, next) {
  try {
    const campaignList = await core.campaign.getCampaign()
    return res.status(200).json({
      campaignList
    });
  } catch (e) {
    return next(e)
  }
}

module.exports = { campaign }
