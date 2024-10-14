const db = require('../database/db');


const createTablaDetail = async (data) => {
    const query = 'INSERT INTO tabla_details (numero_auditoria, field1, field2, field3, field4) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const values = [data.numero_auditoria, data.columna1, data.columna2, data.columna3, data.columna4];
    return await db.query(query, values);
};


const getAllTablaDetails = async () => {
    const query = 'SELECT * FROM tabla_details;';
    return await db.query(query);
};

const deleteTablaDetail = async (id) => {
    const query = 'DELETE FROM tabla_details WHERE id = $1 RETURNING *;';
    const values = [id];
    return await db.query(query, values);
};

module.exports = {
    createTablaDetail,
    getAllTablaDetails,
    deleteTablaDetail
};
