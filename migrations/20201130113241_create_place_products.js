exports.up = function (knex) {
  return knex.schema.createTable('place_products', function (table) {
    table.uuid('place_id').notNull()
    table.foreign('place_id').references('places.id')
    table.uuid('product_id').notNull()
    table.foreign('product_id').references('products.id')

    table.primary(['place_id', 'product_id'])
  })
}

exports.down = function (knex) {}
