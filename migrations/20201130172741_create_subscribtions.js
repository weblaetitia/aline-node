exports.up = function (knex) {  
    return knex.schema.createTable("subscriptions", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("email").notNull();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    });
  };
  
exports.down = function (knex) {};