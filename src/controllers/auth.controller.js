import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import Customer from '../models/customer.model';
import logger from '../config/winston';
import * as CustomerService from '../services/customer.service';
import path from "path";
import Constant from "../utils/constants";
import exp from 'constants';
import User from '../models/user.model';
import { exit } from 'process';


/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function login(req, res) {

  const { email, password } = req.body;

  User.query({ where: { email: email } })
    .fetch({ require: true })
    .then((user) => {

      if (bcrypt.compareSync(password, user.get('password')) ) {
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
      } else {
        logger.log('error', 'Authentication failed. Invalid password.');

        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid username or password.',
        });
      }
    })
    .catch(Customer.NotFoundError, () =>
      res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    );
}

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */

export function accountConfirmation(req,res,next){
  const { token } = req.query;

  CustomerService.verifyAccount(token)
    .then((data) => {
      if (undefined === data) {
        res.sendFile(path.join(__dirname, '../../public/customer/link_expired.html'));
      } else {
        res.sendFile(path.join(__dirname, '../../public/customer/account_verified.html'));
      }
    })
    .catch((err) => console.log(err));

}
