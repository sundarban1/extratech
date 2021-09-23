/**
 * Delete all existing entries and seed users table.
 *
 * @param   {Object} knex
 * @returns {Promise}
 */
exports.seed = function(knex) {
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert([
        {
          first_name: 'Krishna',
          last_name: 'Timilsina',
          email: 'test@gmail.com',
          password: '$2b$10$Kl3EhYqci30qaGiKL1sQJ..XAoXwE9VAuFHKotA/sovK3krg7uHFO',
          status: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    });
}