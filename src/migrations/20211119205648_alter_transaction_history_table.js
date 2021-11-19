exports.up = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.integer('topup_amount').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.dropColumn('topup_amount');
  });
};
