import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Customer from '../models/customer.model';
import User from '../models/user.model';

import logger from '../config/winston';
import * as CustomerService from '../services/customer.service';
import * as UserService from '../services/user.service';
import path from 'path';
import Constant from '../utils/constants';
import exp from 'constants';

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function login(req, res) {
  const { email, password } = req.body;
  try {
    User.query({ where: { email: email } })
      .fetch({ require: true })
      .then((user) => {
        console.log(user);
        if (
          bcrypt.compareSync(password, user.get('password')) &&
          // user.get('is_verified') === 1 &&
          // user.get('status') === Constant.users.status.active
          user.get('status') == 1
        ) {
          const token = jwt.sign(
            {
              id: user.get('id'),
              email: user.get('email'),
            },
            process.env.TOKEN_SECRET_KEY
          );

          res.json({
            success: true,
            token,
            email: user.get('email'),
          });
        } else if ('status' !== 1) {
          res.status(404).json({
            success: false,
            message: 'User is not activated or User is not varified',
          });
        } else {
          logger.log('error', 'Authentication failed. Invalid password.');

          res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid username or password.',
          });
        }
      })
      .catch(User.NotFoundError, () =>
        res.status(404).json({
          success: false,
          message: 'User not found.',
        })
      );
  } catch (e) {
    console.log(e);
  }
}

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */

export function accountConfirmation(req, res, next) {
  const { token } = req.query;

  UserService.verifyAccount(token)
    .then((data) => {
      if (undefined === data) {
        res.sendFile(path.join(__dirname, '../../public/customer/link_expired.html'));
      } else {
        res.sendFile(path.join(__dirname, '../../public/customer/account_verified.html'));
      }
    })
    .catch((err) => console.log(err));
}
