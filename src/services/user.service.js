import Boom from '@hapi/boom';
import bcrypt from 'bcrypt';

import User from '../models/user.model';

/**
 * Get all users.
 *
 * @returns {Promise}
 */
export function getAllUser() {
  return User.forge().fetchAll();
}

/**
 * Get a user.
 *
 * @param   {Number|String}  id
 * @returns {Promise}
 */
export function getUser(id) {
  return new User({ id })
    .fetch({ require: true })
    .then((user) => user)
    .catch(User.NotFoundError, () => {
      throw Boom.notFound('User not found.');
    });
}

/**
 * Create new user.
 *
 * @param   {Object}  user
 * @returns {Promise}
 */
export function storeUser(user) {

  // eslint-disable-next-line camelcase
  const { first_name, middle_name, last_name, email, phone, address} = user;
  const password = bcrypt.hashSync(user.password, 10);

  return new User({
    first_name,
    middle_name,
    last_name,
    email,
    password,
    phone,
    address
  }).save()
  .catch(function(err){
    if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062){
      throw Boom.badRequest(err.sqlMessage)
    }
  });
}

/**
 * Update a user.
 *
 * @param   {Number|String}  id
 * @param   {Object}         user
 * @returns {Promise}
 */
export function updateUser(id, user) {
  // eslint-disable-next-line camelcase
  const { first_name, middle_name, last_name, email, phone, address} = user;

  return new User({ id })
    .save({
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      address
    })
    .catch(User.NoRowsUpdatedError, () => {
      throw Boom.notFound('User not found.');
    });
}

/**
 * Delete a user.
 *
 * @param   {Number|String}  id
 * @returns {Promise}
 */
export function deleteUser(id) {
  return new User({ id })
    .fetch()
    .then((user) => user.destroy())
    .catch(User.NotFoundError, () => {
      throw Boom.notFound('User not found.');
    });
}


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyYW1lc0BnbWFpbC5jb20iLCJpYXQiOjE2MzM1OTQ5OTl9.EqsGnTn7z8JMyfEC8hqifzJ3F-K-5JKAX0RqpbPWq9s