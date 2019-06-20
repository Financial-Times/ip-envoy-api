const client = "pg";

module.exports = {
  production: {
    client,
    connection: `${process.env.DATABASE_URL}?ssl=true`
  },
  development: {
    client,
    connection: `${process.env.DATABASE_URL}`
  }
};
