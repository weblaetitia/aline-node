const { Model } = require("objection");
const knexConnection = require("../database/knex");

Model.knex(knexConnection);

class Places extends Model {
  static get tableName() {
    return "places";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = { Places };
