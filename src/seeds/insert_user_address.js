exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('address').del()
    .then(function () {

      // Inserts seed entries
      return knex('address').insert([
        {
          address_po_box: 'rowValue1',
          city: 'city',
          zip: '09',
          state: 'nsw',
          province: 'campsie',
          country: 'Australia',
          customer_id: 127,
          type: Math.floor((Math.random()) * (3 - 1)) + 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    });
};
