exports.up = function (knex) {
  return knex.schema.createTable("product_places", function (table) {
    table.uuid("product_id").notNull();
    table.foreign("product_id").references("products.id");
    table.uuid("place_id").notNull();
    table.foreign("place_id").references("places.id");
    
    table.primary(["product_id", "place_id"]);
  });
};

exports.down = function (knex) {};
