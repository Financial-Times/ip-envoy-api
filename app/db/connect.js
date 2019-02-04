const knex = require('knex')

const knexUserConfig = require('../../knexfile')
const knexAnonConfig = require('../../knexAnonfile')
const logger = require('../logger')

const maxQueryTimeMillis = process.env.MAX_QUERY_TIME || 2000
const dbConfigList = [ { name: 'user', conf: knexUserConfig }, { name: 'anon', conf: knexAnonConfig } ]
const connections = {};

for (const dbConfig of dbConfigList) {
  let connConfig

  if (dbConfig.name === 'user') {
    connections.user = null;
    continue;
  }

  if (process.env.NODE_ENV === 'production') {
    connConfig = dbConfig['conf']['production']
  } else if (process.env.NODE_ENV === 'development') {
    connConfig = dbConfig['conf']['development']
  } else {
    connConfig = dbConfig['conf']['test']
  }

  const connection = knex(connConfig)
  const times = {}

  connection.on('query', query => {
    const uid = query.__knexQueryUid
    times[uid] = process.hrtime()
  })

  connection.on('query-response', (response, query) => {
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
  });
  
  connections[dbConfig.name] = connection;
}

const connect = entityType => {
  return connections[entityType];
}

module.exports = { connect }
