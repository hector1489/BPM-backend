const db = require('../database/db');

// Crear un registro en la tabla audit_sheet
const createAuditSheet = async (data) => {
  const query = 'INSERT INTO audit_sheet (username, numero_auditoria, field1, field2, field3, field4, field5, field6) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
  const values = [
    data.username,
    data.numero_auditoria,
    data.field1,
    data.field2,
    data.field3,
    data.field4,
    data.field5,
    data.field6,
  ];

  if (!data.username || !data.numero_auditoria) {
    throw new Error('El nombre de usuario y el número de auditoría son obligatorios');
  }

  try {
    const result = await db(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al insertar datos en audit_sheet:', error.message);
    throw new Error('Error en la inserción de datos');
  }
};

// Obtener todos los registros de audit_sheet
const getAllAuditSheets = async () => {
  const query = 'SELECT * FROM audit_sheet;';

  try {
    const result = await db(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener registros de audit_sheet:', error.message);
    throw new Error('No se pudieron recuperar los datos');
  }
};

// Eliminar un registro de audit_sheet por numero_auditoria
const deleteAuditSheet = async (numero_auditoria) => {
  const query = 'DELETE FROM audit_sheet WHERE numero_auditoria = $1 RETURNING *;';
  const values = [numero_auditoria];

  if (!numero_auditoria) {
    throw new Error('El número de auditoría proporcionado no es válido');
  }

  try {
    const result = await db(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar el registro de audit_sheet:', error.message);
    throw new Error('No se pudo eliminar el registro');
  }
};

// Obtener registros por numero_auditoria
const getAuditSheetByNumeroAuditoria = async (numero_auditoria) => {
  const query = 'SELECT * FROM audit_sheet WHERE numero_auditoria = $1;';
  const values = [numero_auditoria];

  if (!numero_auditoria) {
    throw new Error('El número de auditoría proporcionado no es válido o está vacío');
  }

  try {
    const result = await db(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener registros de audit_sheet:', error.message);
    throw new Error('No se pudieron recuperar los datos para el número de auditoría proporcionado');
  }
};

// Obtener registros por username
const getAuditSheetsByUsername = async (username) => {
    const query = 'SELECT * FROM audit_sheet WHERE username = $1;';
    const values = [username];
  
    if (!username) {
      throw new Error('El nombre de usuario proporcionado no es válido o está vacío');
    }
  
    try {
      const result = await db(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener registros de audit_sheet por username:', error.message);
      throw new Error('No se pudieron recuperar los datos para el nombre de usuario proporcionado');
    }
  };

  const deleteAuditSheetById = async (id) => {
    const query = 'DELETE FROM audit_sheet WHERE id = $1 RETURNING *;';
    const values = [id];
  
    if (!id) {
      throw new Error('El id proporcionado no es válido o está vacío');
    }
  
    try {
      const result = await db(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar el registro de audit_sheet por id:', error.message);
      throw new Error('No se pudo eliminar el registro');
    }
  };
  

// Exportar las funciones
module.exports = {
  createAuditSheet,
  getAllAuditSheets,
  deleteAuditSheet,
  getAuditSheetByNumeroAuditoria,
  getAuditSheetsByUsername,
  deleteAuditSheetById
};
