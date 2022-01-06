exports.up = function (knex) {
  return knex.schema.createTable('transaction_history', (table) => {
    table.increments('id').primary().unsigned();
    table.integer('sent_amount').nullable();
    table.integer('receive_amount').nullable();
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.integer('request_amount').nullable();
    table.integer('sender_id').unsigned().index().references('sender_id').inTable('transactions');
    table
      .integer('receiver_id')
      .unsigned()
      .index()
      .references('receiver_id')
      .inTable('transactions');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_bank');
};
