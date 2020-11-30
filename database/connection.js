if (!process.env.PG_CONNECTION_STRING) {
  require("dotenv").config();
}

const knex = require("knex")({
  client: "pg",
  connection: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    tableName: "migrations",
    directory: "./migrations",
  },
});

module.exports = knex;
