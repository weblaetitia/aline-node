module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "postgres",
      host: "localhost",
      user: "postgres",
      password: "password",
      port: "5434",
    },
    migrations: {
      directory: "./migrations",
    },
  },
  production: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
