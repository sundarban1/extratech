exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('banks')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('banks').insert([
        { name: 'Common Wealth Bank', address: '1 Seventh Avenue' },
        { name: 'WestPack Bank', address: '2 Seventh Avenue' },
        { name: 'ANZ Bank', address: '3 Seventh Avenue' },
        { name: 'NAB Bank', address: '4 Seventh Avenue' },
        { name: 'St Geroge Bank', address: '5 Seventh Avenue' },
      ]);
    });
};
