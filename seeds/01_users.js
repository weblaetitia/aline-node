
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          type: 'mobile_user',
          firstname: "Laetitia",
          lastname: "Langlois",
          email: "weblaetitia@hotmail.com",
          password: "TRedlVdeKSkz9XqWL9dntLlUuPlrVWm5nGIhtiVPI+U=",
          token: "O7w1PnK8Dl4gWn4bwSauVKBFtpGUlhl0",
          salt: "CLE1pb8jvGRJmDZ3jRe9PPWvCEoJ1PLe",
        },
        {
          type: 'mobile_user',
          firstname: "Josie",
          lastname: "Lamare",
          email: "weblaetitia@hotmail.fr",
          password: "LxvlsNiFUHT73JKSfqfXDOKIULL5XXflLzFhHi8X780+U=",
          token: "15Lo1CXFsqEjJ0TAYEzfaJ3XL6ZgTp27",
          salt: "YU5EPxAieGB9JjZt5kw7fbRiZCYG8tOy",
        },
        {
          type: 'network_user',
          firstname: "Laetitia",
          lastname: "Langlois",
          email: "weblaetitia@gmail.com",
          password: "EONB+0yJsox6S7hsHcFf+hhVAidcoJlYciJaDRIAtNk=+U=",
          token: "TYWgwwiZEy0fzZKUpYwfFtaXxShh4DZB",
          salt: "Ho6UW7xG7I7g9BZ5D22jic3hyXUJI8lL",
        },
      ]);
    });
};
