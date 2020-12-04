exports.up = function (knex) {
  return knex.schema.createTable("places", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("network_id").notNull();
    table.foreign("network_id").references("networks.id");
    table.string("name").notNull();
    table.string("phone").notNull();
    table.string("adress").notNull();
    table.string("zip_code").notNull();
    table.float("latitude");
    table.float("longitude");
    table.string("website");
    table.string("type");
    table.specificType("services", "text[]");
    table.string("google_place_id");
    table.string("image_url");
    table.specificType("opening_hours", "text[]");
    table.specificType("keywords", "text[]");
  });
};

exports.down = function (knex) {};
