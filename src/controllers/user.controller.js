import HttpStatus from 'http-status-codes';

import * as userService from '../services/user.service';
import { notify } from '../config/mailer';
import * as CustomerService from '../services/customer.service';

/**
 * Find all the users
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} nextuser.model
 */
export function findAll(req, res, next) {
  userService
    .getAllUser()
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 *  Find user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findById(req, res, next) {
  userService
    .getUser(req.params.id)
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 * Store new user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function store(req, res, next) {
  try {
    userService
      .storeUser(req.body)
      .then((data) => {
        const param = data.attributes;
        // const id = data.attributes.id;
        param.template = 'welcome';
        param.confirmationUrl = CustomerService.generateConfirmationUrl(param.token);

        notify(param);
        res.status(200).json({ data });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);
  }
}

export function accountConfirmation(req, res, next) {
  const { token } = req.query;
  const data = req.attributes;

  userService
    .verifyAccount(data)
    .then((data) => {
      if (undefined === data) {
        res.sendFile(path.join(__dirname, '../../public/customer/link_expired.html'));
      } else {
        res.sendFile(path.join(__dirname, '../../public/customer/account_verified.html'));
      }
    })
    .catch((err) => console.log(err));
}

/**
 * Update user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function update(req, res, next) {
  userService
    .updateUser(req.params.id, req.body)
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 * Destroy user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function destroy(req, res, next) {
  userService
    .deleteUser(req.params.id)
    .then((data) => res.status(HttpStatus.NO_CONTENT).json({ data }))
    .catch((err) => next(err));
}

export function register(req, res, next) {
  res.json({ data: req.body });
}
