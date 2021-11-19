import Bank from '../models/bank.model';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';

import UserBank from '../models/user_bank.model';
import TransactioHistory from '../models/transaction_history.model';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { transactioHistory } from '../controllers/user.controller';
import TransactionHitory from '../models/transaction_history.model';

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
  return new User({
    id,
  }).fetch({ require: false });
}

export function checkUserStatus(data, token) {
  return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
    const id = data.receiver_id;
    const status = User.forge('status').fetch();

    return new User({
      id,
      status: 1,
    }).fetch({ require: false });
  });
}

export function checkBalance(data) {
  // return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
  const { sender_id, amount } = data;
  const balance = UserBank.forge('balance').fetch();
  return new UserBank(sender_id)({
    balance: balance - amount > 0,
  }).fetch({ required: false });
}

export function requestAmount(body, params) {
  const sender_id = params.sender_id;
  const receiver_id = params.receiver_id;
  const request_amount = parseFloat(body.amount);

  try {
    return (
      new Transaction().save({
        transaction_number: uuidv4(),
        amount: request_amount,
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: 'pending',
        transaction_type: 'request',
      }),
      new TransactioHistory().save({
        sender_id: sender_id,
        receiver_id: receiver_id,
        request_amount: request_amount,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export function reduceSenderAmount(body, params) {
  const id = params.sender_id;
  const sent_amount = parseFloat(body.amount);
  const receiver_id = params.receiver_id;

  try {
    User.query({ where: { id: id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));
        return new User({ id }).save({
          amount: amount - sent_amount,
        });
      });
    return new TransactioHistory().save({
      id: id,
      sender_id: id,
      receiver_id: receiver_id,
      sent_amount: sent_amount,
    });

    // });
  } catch (err) {
    console.log(err);
  }
}

export function increaeReceiverAmount(body, params) {
  const sender_id = params.sender_id;
  const id = params.receiver_id;
  const sent_amount = parseFloat(body.amount);

  try {
    User.query({ where: { id: id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));
        return new User({ id }).save({
          amount: amount + sent_amount,
        });
      });

    return new TransactioHistory().save({
      id: id,
      sender_id: sender_id,
      receiver_id: id,
      receive_amount: sent_amount,
    });

    // });
  } catch (err) {
    console.log(err);
  }
}
