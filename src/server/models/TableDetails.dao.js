const db = require('../database/db');

const createTablaDetail = async (data) => {
    const query = 'INSERT INTO tabla_details (field1, field2, field3, field4) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [data.columna1, data.columna2, data.columna3, data.columna4];
    return await db.query(query, values);
  };
  
  const getAllTablaDetails = async () => {
    const query = 'SELECT * FROM tabla_details;';
    return await db.query(query);
  };
  
  module.exports = {
    createTablaDetail,
    getAllTablaDetails
  };
  
