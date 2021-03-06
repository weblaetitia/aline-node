exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("network_id").notNull();
    table.foreign("network_id").references("networks.id"); 
    table.string("name").notNull();
    table.string("brand").notNull();
    table.string("type").notNull();
    table.float("refound_price").notNull();
    table.string("barcode");
    table.string("qr_url");
    table.string("image_url"); 
    table.specificType("keywords", "text[]");
  });
};

exports.down = function (knex) {};
