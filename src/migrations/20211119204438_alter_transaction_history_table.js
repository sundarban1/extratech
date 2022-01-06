exports.up = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.integer('user_id').unsigned().index().references('id').inTable('users');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.dropForeign('user_id').dropColumn('user_id');
  });
};
