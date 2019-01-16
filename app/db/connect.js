const knex = require('knex')

const knexConfig = require('../../knexfile')
const logger = require('../logger')

const maxQueryTimeMillis = process.env.MAX_QUERY_TIME || 2000

let connConfig

if (process.env.NODE_ENV === 'production') {
  connConfig = knexConfig.production
} else if (process.env.NODE_ENV === 'development') {
  connConfig = knexConfig.development
} else {
  connConfig = knexConfig.test
}

const db = knex(connConfig)
const times = {}

db.on('query', query => {
  const uid = query.__knexQueryUid
  times[uid] = process.hrtime()
})

db.on('query-response', (response, query) => {
  const uid = query.__knexQueryUid
  const totalHrTime = process.hrtime(times[uid])
  const totalTime = (totalHrTime[0] * 1000) + (totalHrTime[1] / 1000000)
  if (totalTime > maxQueryTimeMillis) {
    logger.info({
      event: 'SLOW_DB_QUERY',
      sql: query.sql,
      params: query.bindings,
      queryTime: totalTime
    })
  }
  delete times[uid]
})

module.exports = db
