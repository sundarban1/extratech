/**
 * Create bank table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.up = function (knex) {
    return knex.schema.createTable('bank', (table) => {
      table.increments('id').primary().unsigned();
      table.string('name').notNullable();
      table.string('address').notNullable();
      table.string('status');
      table.integer('user_id').unsigned().index().references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      //table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
    });
  };
  
  /**
   * Drop bank table.
   *
   * @param   {object} knex
   * @returns {Promise}
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('bank');
  };
  