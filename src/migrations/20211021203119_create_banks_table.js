exports.up = function (knex) {
  return knex.schema.createTable('banks', (table) => {
    table.increments('id').primary().unsigned();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('status').notNullable().defaultTo(1).comment('0: Not Active, 1: Active');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('banks');
};
