/**
 * Create transactions table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary().unsigned();
    table.string('number').notNullable().unique();
    table.string('vendor_name').notNullable();
    table.double('amount', 10, 2).notNullable();
    table.string('status').notNullable();
    table.string('type').nullable();
    table.double('fees', 10, 2).notNullable();
    table.text('description').nullable();
    table.integer('customer_id').unsigned().index().references('id').inTable('customers');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    //table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

/**
 * Drop transactions table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
