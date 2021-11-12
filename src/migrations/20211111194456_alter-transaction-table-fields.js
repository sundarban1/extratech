exports.up = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('time');
    table.dropForeign('bank_id');
    table.dropColumn('bank_id');
    table.dropColumn('balance');
    table.integer('user_id').unsigned().index().references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.timestamp('time').defaultTo(knex.fn.now());
    table.integer('bank_id').unsigned().index().references('id').inTable('banks');
    table.integer('balance').defaultTo(1000);
    table.dropForeign('user_id').dropColumn('user_id');
  });
};
