exports.up = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.integer('sender_id').nullable();
    table.integer('receiver_id').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transaction_history', (table) => {
    table.dropColumn('sender_id');
    table.dropColumn('receiver_id');
  });
};
