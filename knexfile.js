const client = 'pg';

module.exports = {
  production: {
    client,
    connection: `${process.env.DB_HOST}?ssl=true`,
  },
  development: {
    client,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    },
    pool: {
      min: 0,
      max: 7
    }
  }
}
