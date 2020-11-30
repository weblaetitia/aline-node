exports.up = async function (knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');

  return knex.schema.createTable("users", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("type").notNull();
    table.string("firstname").notNull();
    table.string("lastname").notNull();
    table.string("email").notNull();
    table.string("token").notNull();
    table.string("salt").notNull();
    table.string("phone_number");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("last_login");
  });
};

exports.down = function (knex) {};
