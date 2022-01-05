"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require('pg');
const PG_URI = 'postgres://mvilptfq:W5-KAiYVVKOgDimT4mY4-vbBzJL7pxXz@castor.db.elephantsql.com/mvilptfq';
const pool = new Pool({
    connectionString: PG_URI,
    max: 5,
});
const db = {
    query: function (queryString, params, callback) {
        return pool.query(queryString, params, callback);
    },
};
exports.default = db;
