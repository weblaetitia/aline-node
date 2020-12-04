const { Model } = require("objection");
const knexConnection = require("../database/knex");

const { Places } = require("./Places");

Model.knex(knexConnection);

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      places: {
        join: {
          from: "users.id",
          through: {
            from: "user_places.user_id",
            to: "user_places.place_id",
          },
          to: "places.id",
        },
        modelClass: Places,
        relation: Model.ManyToManyRelation,
      },
    };
  }
}

module.exports = { Users };
