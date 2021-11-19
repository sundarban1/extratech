exports.up = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.dropForeign('sender_id');
    table.dropColumn('sender_id');
    table.dropForeign('user_id');
    table.dropColumn('user_id');
    table.dropForeign('receiver_id');
    table.dropColumn('receiver_id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.integer('sender_id').unsigned().index().references('sender_id').inTable('transactions');
    table
      .integer('receiver_id')
      .unsigned()
      .index()
      .references('receiver_id')
      .inTable('transactions');
  });
};
