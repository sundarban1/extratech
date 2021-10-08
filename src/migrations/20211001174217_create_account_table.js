/**
 * Create account table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.up = function (knex) {
    return knex.schema.createTable('account', (table) => {
      table.increments('id').primary().unsigned();
      table.string('profile_image').nullable();
      table.double('wallet_amount', 10, 2).default(0);
      table.double('total_send_amount', 10, 2).default(0);
      table.double('total_received_amount', 10, 2).default(0);
      table.string('status');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      //table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
    });
  };
  
  /**
   * Drop account table.
   *
   * @param   {object} knex
   * @returns {Promise}
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('account');
  };
  