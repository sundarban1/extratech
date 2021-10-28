import HttpStatus from 'http-status-codes';
import * as userService from '../services/user.service';
import * as bankService from '../services/bank.service';
import { notify } from '../config/mailer';
import * as CustomerService from '../services/customer.service';
import User from '../models/user.model';
import UserBank from '../models/user_bank.model';

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

export function transaction(req, res, next) {
  var sender_id = req.body.sender_id;
  var receiver_id = req.body.receiver_id;
  var sent_amount = parseFloat(req.body.amount);

  try {
    User.query({ where: { id: sender_id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));

        if (amount < 1) {
          console.log('amount', amount);
          res.status(422).json({ error: 'Please recharge your account.' });
        } else {
          if (amount < sent_amount) {
            res
              .status(422)
              .json({ error: 'You do not have enough balance to make this transaction.' });
          } else {
            {
              /* TODO:    
          
          Check if the user is exits or not
          
          */
            }
            User.query({ where: { id: receiver_id } })
              .fetch({ require: false })
              .then((data) => {
                if (data.get('status') != 1) {
                  res
                    .status(422)
                    .json({ error: 'The receiver is either not activated or not a user' });
                }
              });
          }

          bankService.reduceSenderAmount(req.body);
          bankService.increaeReceiverAmount(req.body);

          // param.template = 'welcome';
          // notify(param);
          res.status(200).json({ success: 'Transfer Succesfully.' });
        }
      });
  } catch (error) {
    console.log(error);
  }
}

export function addBank(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  let token = authorizationHeader.split(' ')[1];
  bankService.checkBank(req.body).then((data) => {
    if (data == null) {
      res.status(422).json({ error: 'Bank does not exist.' });
    } else {
      userService.checkExistingAccount(req.body).then((data) => {
        if (data != null) {
          res.status(422).json({ error: 'This account is already existed.' });
        } else {
          userService
            .addBank(req.body, token)
            .then((bank) => res.status(200).json({ bank }))
            .catch((err) => next(err));
        }
      });
    }
  });
}

export function accountConfirmation(req, res, next) {
  const { token } = req.query;
  const data = req.attributes;

  userService
    .verifyAccount(token)
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
