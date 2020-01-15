const client = "pg";

module.exports = {
  production: {
    client,
    connection: `${process.env.DATABASE_URL}?ssl=true`
  },
  development: {
    debug: false,
    client,
    connection: `${process.env.DATABASE_URL}`
  }
};
