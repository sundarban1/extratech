exports.up = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('time');
    table.dropForeign('bank_id');
    table.dropColumn('bank_id');
    table.dropColumn('balance');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.timestamp('time').defaultTo(knex.fn.now());
    table.integer('bank_id').unsigned().index().references('id').inTable('banks');
    table.integer('balance').defaultTo(1000);
  });
};
