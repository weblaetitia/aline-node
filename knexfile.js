module.exports = {
  development: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME || "postgres",
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      port: process.env.DB_PORT || "5434",
    },
    migrations: {
      directory: "./migrations",
    },
  },
  production: {
    client: "pg",
    connection: {
      database: process.env.DB_NAME || "postgres",
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      port: process.env.DB_PORT || "5434",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
