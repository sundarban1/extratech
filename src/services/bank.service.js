import Bank from '../models/bank.model';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';

import UserBank from '../models/user_bank.model';
import jwt from 'jsonwebtoken';

/**
 * Get all customers.
 *
 * @returns {Promise}
 */

export function getAllBanks() {
  return Bank.forge().fetchAll();
}

export function checkBank(data) {
  const id = data.bank_id;
  return new Bank({
    id,
  }).fetch({ require: false });
}

export function checkReceiver(data) {
  const id = data.receiver_id;
  const status = User.status;
  return new User({
    id,
    status: 1,
  }).fetch({ require: false });
}

export function checkBalance(data) {
  const amount = data.amount;
  const balance = UserBank.balance;
  return new UserBank({
    balance: balance - amount > 0,
  }).fetch({ require: false });
}

export function reduceSenderAmount(data, token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      const { sender_id, amount } = data;
      const balance = UserBank.balance;

      return new UserBank(sender_id).save({
        balance: balance - amount,
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export function increaeReceiverAmount(data, token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      const { receiver_id, amount } = data;

      return new UserBank(receiver_id).save({
        balance: balance + amount,
      });
    });
  } catch (error) {
    console.log(error);
  }
}
