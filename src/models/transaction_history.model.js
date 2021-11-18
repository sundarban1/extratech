import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'transaction_history';

/**
 * Bank model.
 */
class TransactionHitory extends bookshelf.Model {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }

  /**
   * Table has timestamps.
   */
  get hasTimestamps() {
    return true;
  }
}

export default TransactionHitory;
