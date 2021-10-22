import Bank from '../models/bank.model';

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
