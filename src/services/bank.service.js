import Bank from '../models/bank.model';

/**
 * Get all customers.
 *
 * @returns {Promise}
 */

export function getAllBanks() {
  return Bank.forge().fetchAll();
}
