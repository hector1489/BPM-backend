// models/Desviaciones.dao.js

const db = require('../database/db');

const createDesviacion = async (desviacionData) => {
  const {
    numeroRequerimiento,
    preguntasAuditadas,
    desviacionOCriterio,
    tipoDeAccion,
    responsableProblema,
    local,
    criticidad,
    accionesCorrectivas,
    fechaRecepcionSolicitud,
    fechaSolucionProgramada,
    estado,
    fechaCambioEstado,
    contactoClientes,
    evidenciaFotografica,
    detalleFoto,
    auditor,
    correo,
    fechaUltimaModificacion,
    authToken
  } = desviacionData;

  // Validación de los campos antes de realizar la inserción
  if (!numeroRequerimiento || !preguntasAuditadas || !desviacionOCriterio || 
      !tipoDeAccion || !responsableProblema || !local || !criticidad ||
      !accionesCorrectivas || !fechaRecepcionSolicitud || !fechaSolucionProgramada ||
      !estado || !fechaCambioEstado || !contactoClientes || !evidenciaFotografica ||
      !detalleFoto || !auditor || !correo || !fechaUltimaModificacion || 
      !authToken) {
    throw new Error('Datos incompletos o inválidos.');
  }

  try {
    await db(
      `INSERT INTO desviaciones (
        numero_requerimiento, 
        preguntas_auditadas, 
        desviacion_o_criterio, 
        tipo_de_accion, 
        responsable_problema, 
        local, 
        criticidad, 
        acciones_correctivas, 
        fecha_recepcion_solicitud, 
        fecha_solucion_programada, 
        estado, 
        fecha_cambio_estado, 
        contacto_clientes, 
        evidencia_fotografica, 
        detalle_foto, 
        auditor, 
        correo, 
        fecha_ultima_modificacion,
        auth_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        numeroRequerimiento,
        preguntasAuditadas,
        desviacionOCriterio,
        tipoDeAccion,
        responsableProblema,
        local,
        criticidad,
        accionesCorrectivas,
        fechaRecepcionSolicitud,
        fechaSolucionProgramada,
        estado,
        fechaCambioEstado,
        contactoClientes,
        evidenciaFotografica,
        detalleFoto,
        auditor,
        correo,
        fechaUltimaModificacion,
        authToken
      ]
    );
  } catch (error) {
    throw new Error('Error al almacenar los datos en la base de datos');
  }
};


module.exports = {
  createDesviacion,
};



