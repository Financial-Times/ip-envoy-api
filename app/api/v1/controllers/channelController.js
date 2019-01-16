import { channel } from '../core'
import logger from '../logger'

async function getTypes(req, res, next) {
  try {
    const result = await channel.getTypes()
    res.status(200).json({
      result
    });
    return next()
  } catch (e) {
    return next(e)
  }
}

async function get(req, res, next) {
  try {
    const result = await channel.get(req.params.typeId)
    res.status(200).json({
      result
    });
    return next()
  } catch (e) {
    return next(e)
  }
}

export { getTypes, get }
