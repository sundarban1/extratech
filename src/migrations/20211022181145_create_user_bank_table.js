exports.up = function (knex) {
  return knex.schema.createTable('user_bank', (table) => {
    table.increments('id').primary().unsigned();
    table.string('bsb').notNullable();
    table.string('account').notNullable();
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.integer('bank_id').unsigned().index().references('id').inTable('banks');
    table.double('balance', 10, 2).defaultTo(1000);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_bank');
};
