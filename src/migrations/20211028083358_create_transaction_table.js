exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary().unsigned();
    table.string('transaction_number').notNullable();
    table.double('amount', 10, 2).notNullable();
    table.timestamp('time').defaultTo(knex.fn.now());
    table.integer('bank_id').unsigned().index().references('id').inTable('banks');
    table.integer('sender_id').unsigned().index().references('id').inTable('users');
    table.integer('receiver_id').unsigned().index().references('id').inTable('users');
    table.integer('balance').defaultTo(1000);
    table.string('status').nullable();
    table.string('transaction_type').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
