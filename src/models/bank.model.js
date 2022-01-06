import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'banks';

/**
 * Bank model.
 */
class Bank extends bookshelf.Model {
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

export default Bank;
