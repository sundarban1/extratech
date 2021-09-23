import bookshelf from '../config/bookshelf';
import Address from './address.model';

const TABLE_NAME = 'customers';

/**
 * Customer model.
 */
class Customer extends bookshelf.Model {
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

  address() {
    return this.hasMany(Address, 'customer_id', 'id');
  }

}

export default Customer;
