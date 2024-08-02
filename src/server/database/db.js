require('dotenv').config();
const { Pool } = require('pg');

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: true,
};

const pool = new Pool(config);

const db = (query, values) => pool
  .query(query, values)
  .then(({ rows }) => rows)
  .catch(({ code, message }) => {
    const error = { status: '[ERROR]', code, message };
    throw error;
  });

module.exports = db;
