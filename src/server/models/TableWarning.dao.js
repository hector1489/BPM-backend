const db = require('../database/db');

const createTablaWarning = async (data) => {
    const query = 'INSERT INTO tabla_warning (field1, field2) VALUES ($1, $2) RETURNING *;';
    const values = [data.field1, data.field2];
    return await db(query, values);
};

const getAllTablaWarnings = async () => {
    const query = 'SELECT * FROM tabla_warning;';
    return await db(query);
};

module.exports = {
    createTablaWarning,
    getAllTablaWarnings
};
