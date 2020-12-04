exports.up = function (knex) {
  return knex.schema.createTable("user_places", function (table) {
    table.uuid("user_id").notNull();
    table.foreign("user_id").references("users.id");
    table.uuid("place_id").notNull();
    table.foreign("place_id").references("places.id");

    table.primary(["user_id", "place_id"]);
  });
};

exports.down = function (knex) {};
