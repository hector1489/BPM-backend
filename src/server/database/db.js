const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(config);

const db = async (query, values) => {
  try {
    const result = await pool.query(query, values)
    console.log(query, values)
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}


module.exports = db;


