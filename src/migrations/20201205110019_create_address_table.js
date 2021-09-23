/**
 * Create address table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
  return knex.schema.createTable('address', (table) => {
    table.increments('id').primary().unsigned();
    table.string('address_po_box').nullable();
    table.string('city').notNullable();
    table.string('zip').nullable();
    table.string('state').nullable();
    table.string('province').nullable();
    table.string('country').notNullable();
    table.integer('customer_id').unsigned().index().references('id').inTable('customers');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    //table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

/**
 * Drop address table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
  return knex.schema.dropTable('address');
};
