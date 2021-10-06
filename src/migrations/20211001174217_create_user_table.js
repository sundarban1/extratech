/**
 * Create users table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
 exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary().unsigned();
      table.string('first_name').notNullable();
      table.string('middle_name').nullable();
      table.string('last_name').notNullable();
      table.string('address').notNullable();
      table.string('email').notNullable().unique('admin_email');
      table.string('password').notNullable();
      table.timestamp('date_of_birth').notNullable();
      table.string('contact_no').notNullable().unique('cus_phone');
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
   * Drop users table.
   *
   * @param   {object} knex
   * @returns {Promise}
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  