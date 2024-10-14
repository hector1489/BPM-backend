const db = require('../database/db');

// Función para crear múltiples registros en tabla_details
const createTablaDetail = async (dataList) => {
  const query = 'INSERT INTO tabla_details (numero_auditoria, field1, field2, field3, field4) VALUES ($1, $2, $3, $4, $5) RETURNING *;';

  if (!Array.isArray(dataList)) {
    throw new Error('Se esperaba un array de datos');
  }

  if (dataList.length === 0) {
    throw new Error('El array de datos está vacío');
  }

  const insertPromises = dataList.map(async (data) => {
  
    if (!data.numero_auditoria || !data.columna2 || !data.columna3 || !data.columna4) {
      throw new Error(`Los campos obligatorios están vacíos para el registro: ${JSON.stringify(data)}`);
    }

    const values = [data.numero_auditoria, data.columna2, data.columna3, data.columna4];

    try {
      return await db.query(query, values);
    } catch (error) {
      console.error('Error al insertar datos:', error.message);
      throw new Error('Error en la inserción de datos');
    }
  });

  try {
    return await Promise.all(insertPromises);
  } catch (error) {
    console.error('Error en la operación de inserción:', error.message);
    throw new Error('Error en la inserción de los registros');
  }
};

// Función para obtener todos los registros de tabla_details
const getAllTablaDetails = async () => {
  const query = 'SELECT * FROM tabla_details;';

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los detalles de la tabla:', error.message);
    throw new Error('No se pudieron recuperar los datos');
  }
};

// Función para eliminar un registro por ID en tabla_details
const deleteTablaDetail = async (id) => {
  const query = 'DELETE FROM tabla_details WHERE id = $1 RETURNING *;';
  const values = [id];

  if (!id || isNaN(id)) {
    throw new Error('El ID proporcionado no es válido');
  }

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      throw new Error('No se encontró ningún registro con el ID proporcionado');
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar el detalle:', error.message);
    throw new Error('No se pudo eliminar el registro');
  }
};

// Exportar las funciones
module.exports = {
  createTablaDetail,
  getAllTablaDetails,
  deleteTablaDetail
};
