import bookshelf from '../config/bookshelf';

const TABLE_NAME = 'user_bank';

/**
 * Bank model.
 */
class UserBank extends bookshelf.Model {
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

export default UserBank;
