const db = require('../database/db');

const createTablaDetail = async (data) => {
    const query = 'INSERT INTO tabla_details (field1, field2) VALUES ($1, $2) RETURNING *;';
    const values = [data.field1, data.field2];
    return await db(query, values);
};

const getAllTablaDetails = async () => {
    const query = 'SELECT * FROM tabla_details;';
    return await db(query);
};

module.exports = {
    createTablaDetail,
    getAllTablaDetails
};
