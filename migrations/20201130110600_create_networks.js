exports.up = function (knex) {
  return knex.schema.createTable("networks", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("user_id").unique().notNull();
    table.foreign("user_id").references("users.id");
    table.string("business_name").notNull();
    table.string("adress").notNull();
    table.string("zip_code").notNull();
    table.string("city").notNull();
    table.string("website");
    table.string("deposite_type").notNull();
    table.string("image_url");
    table.specificType("keywords", "text[]");
  });
};

exports.down = function (knex) {};
