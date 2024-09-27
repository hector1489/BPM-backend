const db = require('../database/db');
const moment = require('moment');
const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const handleEmptyField = (value) => {
  return value && value.trim() !== '' ? value : 'N/A';
};

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

  // Helper function to format dates
  const formatDate = (dateString) => {
    const formattedDate = moment(dateString, 'D/M/YYYY', true); // Strict parsing
    return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : 'N/A';
  };

  // Handle undefined or null fields
  const safeValues = {
    numeroRequerimiento: handleEmptyField(numeroRequerimiento),
    preguntasAuditadas: handleEmptyField(preguntasAuditadas),
    desviacionOCriterio: handleEmptyField(desviacionOCriterio),
    tipoDeAccion: handleEmptyField(tipoDeAccion),
    responsableProblema: handleEmptyField(responsableProblema),
    local: handleEmptyField(local),
    criticidad: handleEmptyField(criticidad),
    accionesCorrectivas: handleEmptyField(accionesCorrectivas),
    fechaRecepcion: formatDate(fechaRecepcionSolicitud),
    fechaSolucion: formatDate(fechaSolucionProgramada),
    estado: handleEmptyField(estado),
    fechaCambio: formatDate(fechaCambioEstado),
    contactoClientes: handleEmptyField(contactoClientes),
    evidenciaFotografica: handleEmptyField(evidenciaFotografica),
    detalleFoto: handleEmptyField(detalleFoto),
    auditor: handleEmptyField(auditor),
    correo: handleEmptyField(correo),
    fechaModificacion: formatDate(fechaUltimaModificacion),
    authToken: authToken || 'N/A' // Default to 'N/A' if authToken is missing
  };

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
        safeValues.numeroRequerimiento,
        safeValues.preguntasAuditadas,
        safeValues.desviacionOCriterio,
        safeValues.tipoDeAccion,
        safeValues.responsableProblema,
        safeValues.local,
        safeValues.criticidad,
        safeValues.accionesCorrectivas,
        safeValues.fechaRecepcion,
        safeValues.fechaSolucion,
        safeValues.estado,
        safeValues.fechaCambio,
        safeValues.contactoClientes,
        safeValues.evidenciaFotografica,
        safeValues.detalleFoto,
        safeValues.auditor,
        safeValues.correo,
        safeValues.fechaModificacion,
        safeValues.authToken
      ]
    );

    // Prepare and send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: safeValues.correo.trim() !== '' ? safeValues.correo : 'fungilydev@gmail.com',
      subject: 'BPM AUDITORIAS',
      text: `Se ha creado una nueva Incidencia con el número de requerimiento: ${safeValues.numeroRequerimiento}.
      
      USUARIO: ${safeValues.auditor}

      Detalles de la desviación:
      - Preguntas Auditadas: ${safeValues.preguntasAuditadas}
      - Desviación o Criterio: ${safeValues.desviacionOCriterio}
      - Tipo de Acción: ${safeValues.tipoDeAccion}
      - Responsable del Problema: ${safeValues.responsableProblema}
      - Local: ${safeValues.local}
      - Criticidad: ${safeValues.criticidad}
      - Fecha de Recepción: ${safeValues.fechaRecepcion}
      - Fecha de Solución Programada: ${safeValues.fechaSolucion}
      - Estado: ${safeValues.estado}
      - Contacto con Clientes: ${safeValues.contactoClientes}
      
      Por favor, revisa el sistema para más detalles.`,
    };

    // Send email using nodemailer
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente.');

  } catch (error) {
    console.error('Error al almacenar los datos en la base de datos o enviar el correo:', error.message);
    // Consider logging the error or handling it as needed
  }
};


// Recuperar todas las desviaciones
const getAllDesviaciones = async () => {
  try {
    const results = await db(`SELECT * FROM desviaciones`);
    return results.rows;
  } catch (error) {
    throw new Error('Error al recuperar las desviaciones de la base de datos');
  }
};

// Actualizar una desviación por ID
const updateDesviacion = async (id, desviacionData) => {
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

  const fechaRecepcion = moment(fechaRecepcionSolicitud, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaSolucion = moment(fechaSolucionProgramada, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaCambio = moment(fechaCambioEstado, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaModificacion = moment(fechaUltimaModificacion, 'D/M/YYYY').format('YYYY-MM-DD');

  try {
    await db(
      `UPDATE desviaciones SET 
        numero_requerimiento = $1,
        preguntas_auditadas = $2,
        desviacion_o_criterio = $3,
        tipo_de_accion = $4,
        responsable_problema = $5,
        local = $6,
        criticidad = $7,
        acciones_correctivas = $8,
        fecha_recepcion_solicitud = $9,
        fecha_solucion_programada = $10,
        estado = $11,
        fecha_cambio_estado = $12,
        contacto_clientes = $13,
        evidencia_fotografica = $14,
        detalle_foto = $15,
        auditor = $16,
        correo = $17,
        fecha_ultima_modificacion = $18,
        auth_token = $19
      WHERE id = $20`,
      [
        numeroRequerimiento,
        preguntasAuditadas,
        desviacionOCriterio,
        tipoDeAccion,
        responsableProblema,
        local,
        criticidad,
        accionesCorrectivas,
        fechaRecepcion,
        fechaSolucion,
        estado,
        fechaCambio,
        contactoClientes,
        evidenciaFotografica,
        detalleFoto,
        auditor,
        correo,
        fechaModificacion,
        authToken,
        id
      ]
    );
  } catch (error) {
    throw new Error('Error al actualizar la desviación en la base de datos');
  }
};

const deleteDesviacion = async (id) => {
  try {
    await db(`DELETE FROM desviaciones WHERE id = $1`, [id]);
  } catch (error) {
    throw new Error('Error al eliminar la desviación en la base de datos');
  }
};

// Obtener desviaciones por auditor
const getDesviacionesByAuditor = async (auditor) => {
  try {
    const results = await db(`SELECT * FROM desviaciones WHERE auditor = $1`, [auditor]);
    return results.rows;
  } catch (error) {
    throw new Error('Error al recuperar desviaciones por auditor');
  }
};


module.exports = {
  createDesviacion,
  getAllDesviaciones,
  updateDesviacion,
  deleteDesviacion,
  getDesviacionesByAuditor
};
