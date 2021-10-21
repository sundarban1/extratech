import HttpStatus from 'http-status-codes';

import * as BankService from '../services/bank.service';
import { notify } from '../config/mailer';
import Address from '../models/address.model';

/**
 * Find all the customers
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findAllBank(req, res, next) {
  try {
    BankService.getAllBanks()
      .then((data) => res.json({ data }))
      .catch((err) => next(err));
  } catch (e) {
    console.log(e);
  }
}
