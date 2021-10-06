import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';

import Customer from '../models/customer.model';
import logger from '../config/winston';
import * as CustomerService from '../services/customer.service';
import path from "path";
import Constant from "../utils/constants";
import { rest, result } from 'lodash';
import User from '../models/user.model';
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
  Customer.query({ where: { email: email } })
    .fetch({ require: true })
    .then((user) => {
      if (bcrypt.compareSync(password, user.get('password')) && user.get('is_verified') === 1 && user.get('status') === Constant.users.status.active ) {
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
        message: 'Customer not found.',
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

export function validate(req,res,next){
  res.json({"key":"value"});
}

export function nitin(req,res,next){
  res.json({"name":"Ramesh","id" :req.query.id, "token":req.query.token});
}

export function postreq(req,res,next) {
  res.send('Hello this is a successful post request.');
}

export function createAccount(req,res,next) {
  res.json({"result":"success"});
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user= new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,
        dob: req.body.dob
      });
      user
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message:"User created"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  });
}