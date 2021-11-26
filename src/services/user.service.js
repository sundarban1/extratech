import Boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Transaction from '../models/transaction.model';
import TransactionHitory from '../models/transaction_history.model';

import User from '../models/user.model';
// import Bank from '../models/bank.model';
import UserBank from '../models/user_bank.model';

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

export function getUserByEmail(email) {
  return new User({ email })
    .fetch({ require: false })
    .then((user) => user)
    .catch(User.NotFoundError, () => {
      throw Boom.notFound('User not found.');
    });
}

export function getUserByPhone(email) {
  return new User({ phone })
    .fetch({ require: false })
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

export function addBank(bank, token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      const { bank_id, bsb, account, balance } = bank;
      let user_id = decoded.id;
      return new UserBank({
        user_id,
        bank_id,
        bsb,
        account,
        balance,
      }).save();
    });
  } catch (e) {
    console.log(e);
  }
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

//check the existing user
export function checkExistingAccount(data) {
  const { bsb, account } = data;
  return new UserBank({
    bsb,
    account,
  }).fetch({ require: false });
}

///
export function increaseReceiverAmount(transaction_id) {
  Transaction.query({ where: { id: transaction_id } })
    .fetch({ require: false })
    .then((data) => {
      // const user_id = data.get('sender_id');
      const req_amount = parseFloat(data.get('amount'));
      const receiver_id = data.get('receiver_id');
      //req 1, send 2

      return User.query({ where: { id: receiver_id } })
        .fetch({ require: false })
        .then((data) => {
          const balance = parseFloat(data.get('amount'));
          const total_receive = parseFloat(data.get('total_recieve'));

          // balance = balance + req_amount;
          return new User({ id: receiver_id }).save({
            amount: balance + req_amount,
            total_recieve: total_receive + req_amount,
          });
        });
    });
}

///

export function reduceSenderAmount(transaction_id, user_id) {
  Transaction.query({ where: { id: transaction_id } })
    .fetch({ require: false })
    .then((data) => {
      const req_amount = parseFloat(data.get('amount'));
      const sender_id = data.get('sender_id');

      return User.query({ where: { id: sender_id } })
        .fetch({ require: false })
        .then((data) => {
          const balance = parseFloat(data.get('amount'));
          const total_sent = parseFloat(data.get('total_sent'));
          if (balance < req_amount) {
            return false;
          } else {
            // balance = balance - req_amount;
            return new User({ id: sender_id }).save({
              amount: balance - req_amount,
              total_sent: total_sent + req_amount,
            });
          }
        });
    });
}

export function reduceBankBalance(data, params) {
  const user_id = params.user_id;

  const bank_id = data.bank_id;

  const sent_balance = parseFloat(data.balance);
  console.log(user_id, 'User Id');
  console.log(bank_id, 'Bank Id');
  console.log(sent_balance, 'Sent balance');

  try {
    UserBank.query({ where: { bank_id: bank_id, user_id: user_id } })
      .fetch({ require: false })
      .then((data) => {
        const balance = parseFloat(data.get('balance'));
        console.log(balance, 'Account balance');

        return new UserBank({ bank_id, user_id }).save({
          balance: balance - sent_balance,
        });
      });
  } catch (error) {
    console.log(error);
  }
}

export function increaseUserAmount(data, params) {
  const sent_balance = parseFloat(data.balance);
  const id = params.user_id;
  try {
    User.query({ where: { id: id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));
        return new User({ id }).save({
          amount: amount + sent_balance,
        });
      });
    return new TransactionHitory().save({
      user_id: id,
      topup_amount: sent_balance,
    });
  } catch (error) {
    console.log(error);
  }
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
