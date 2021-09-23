
exports.up = function(knex) {
  return knex.schema.table('address', function (table) {
    table.integer('type').nullable().comment('1:home, 2:office');
  });
};

exports.down = function(knex) {
  return knex.schema.table('address', function (table) {
    table.dropColumn('type');
  });
};
