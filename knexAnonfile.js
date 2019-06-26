const client = "pg";

module.exports = {
  production: {
    client,
    connection: `${process.env.DATABASE_URL_ANON}?ssl=true`
  },
  development: {
    client,
    connection: `${process.env.DATABASE_URL_ANON}`
  }
};
