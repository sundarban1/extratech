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
  const { first_name, middle_name, last_name, email, phone, address } = user;
  const password = bcrypt.hashSync(user.password, 10);
  const token = bcrypt.hashSync('token', 10);

  return new User({
    first_name,
    middle_name,
    last_name,
    email,
    password,
    phone,
    address,
    token,
  }).save();
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
  const { first_name, last_name, email, status } = user;

  return new User({ id })
    .save({
      first_name: first_name,
      last_name: last_name,
      email: email,
      status: status,
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

export function verifyAccount(token) {
  return new User({ token: token })
    .fetch({ require: false })
    .then((user) => {
      if (user !== null) {
        const id = user.attributes.id;

        return new User({ id }).save({
          // is_verified: 1,
          status: 1,
          // remember_token: null,
        });
      } else {
        user = null;
      }
    })
    .catch(User.NotFoundError, () => {
      throw Boom.notFound('User not found.');
    });
}
