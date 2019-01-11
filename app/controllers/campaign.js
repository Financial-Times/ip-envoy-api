import core from '../core'
import logger from '../logger'

async function campaign(req, res, next) {
  try {
    const campaignList = await core.campaign.getCampaign()
    res.status(200).json({
      campaignList
    });
    return next()
  } catch (e) {
    return next(e)
  }
}

export { campaign }
