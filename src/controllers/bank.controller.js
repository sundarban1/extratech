import HttpStatus from 'http-status-codes';

import * as BankService from '../services/bank.service';

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
      //or Bank.forge().fetchAll();
      .then((data) => res.json({ data }))
      .catch((err) => next(err));
  } catch (e) {
    console.log(e);
  }
}
