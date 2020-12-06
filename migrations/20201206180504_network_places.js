exports.up = function (knex) {
    return knex.schema.createTable("network_places", function (table) {
      table.uuid("network_id").notNull();
      table.foreign("network_id").references("networks.id");
      table.uuid("place_id").notNull();
      table.foreign("place_id").references("places.id");
  
      table.primary(["network_id", "place_id"]);
    });
  };
  
  exports.down = function (knex) {};
  