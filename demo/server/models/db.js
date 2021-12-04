import { Pool } from ('pg')

const PG_URI = 'postgres://mvilptfq:W5-KAiYVVKOgDimT4mY4-vbBzJL7pxXz@castor.db.elephantsql.com/mvilptfq';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: function (queryString, params, callback) {
    console.log(`Executed query: ${queryString}`);
    return pool.query(queryString, params, callback);
  },
};
