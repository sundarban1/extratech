/**
 * Create transfers table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
  return knex.schema.createTable('transfers', (table) => {
    table.increments('id').primary().unsigned();
    table.string('number').notNullable().unique();
    table.integer('sender').notNullable();
    table.integer('receiver').notNullable();
    table.bool('is_request').notNullable();
    table.double('amount', 10, 2).notNullable();
    table.double('fees', 10, 2).notNullable();
    table.text('description').nullable();
    table.string('status').notNullable();
    table.string('password').notNullable();
    table.integer('customer_id').unsigned().index().references('id').inTable('customers');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    //table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

/**
 * Drop transfers table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('transfers');
};
