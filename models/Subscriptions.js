const { Model } = require("objection");
const knexConnection = require("../database/knex");

Model.knex(knexConnection);

class Subscriptions extends Model {
  static get tableName() {
    return "subscriptions";
  }

  static get idColumn() {
    return "id";
  }
}

module.exports = { Subscriptions };
