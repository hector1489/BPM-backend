const db = require('../database/db');

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

    const values = [data.numero_auditoria, data.columna1, data.columna2, data.columna3, data.columna4];

    try {
      return await db(query, values);
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

const getAllTablaDetails = async () => {
  const query = 'SELECT * FROM tabla_details;';

  try {
    const result = await db(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los detalles de la tabla:', error.message);
    throw new Error('No se pudieron recuperar los datos');
  }
};

const  deleteTablaDetail = async (numero_auditoria) => {
  const query = 'DELETE FROM tabla_details WHERE numero_auditoria = $1 RETURNING *;';
  const values = [numero_auditoria];

  if (!numero_auditoria) {
    throw new Error('El número de auditoría proporcionado no es válido');
  }

  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.error('Error al eliminar los registros:', error.message);
    throw new Error('No se pudieron eliminar los registros');
  }
};

const getTablaDetailsByNumeroAuditoria = async (numero_auditoria) => {
  const query = 'SELECT * FROM tabla_details WHERE numero_auditoria = $1;';
  const values = [numero_auditoria];

  if (!numero_auditoria) {
    throw new Error('El número de auditoría proporcionado no es válido o está vacío');
  }

  try {
    console.log(`Buscando registros para numero_auditoria: ${numero_auditoria}`);

    const result = await db(query, values);


    if (result.rows.length === 0) {
      console.log('No se encontraron registros para el número de auditoría:', numero_auditoria);
      return []; 
    }

    return result.rows;
  } catch (error) {
    console.error('Error al obtener los detalles por número de auditoría:', error.message);
    throw new Error('No se pudieron recuperar los datos para el número de auditoría proporcionado');
  }
};

const getDistinctAuditoriaNumbers = async () => {
  const query = 'SELECT DISTINCT numero_auditoria FROM tabla_details;';

  try {
    const result = await db(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los números de auditoría:', error.message);
    throw new Error('No se pudieron recuperar los números de auditoría');
  }
};



// Exportar las funciones
module.exports = {
  createTablaDetail,
  getAllTablaDetails,
  deleteTablaDetail,
  getTablaDetailsByNumeroAuditoria,
  getDistinctAuditoriaNumbers
};
