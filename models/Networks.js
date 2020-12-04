const { Model } = require("objection");
const knexConnection = require("../database/knex");

Model.knex(knexConnection);

class Networks extends Model {
  static get tableName() {
    return "networks";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = { Networks };
