const db = require('../database/db');
const moment = require('moment');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

  const fechaRecepcion = moment(fechaRecepcionSolicitud, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaSolucion = moment(fechaSolucionProgramada, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaCambio = moment(fechaCambioEstado, 'D/M/YYYY').format('YYYY-MM-DD');
  const fechaModificacion = moment(fechaUltimaModificacion, 'D/M/YYYY').format('YYYY-MM-DD');
  
  // Validación de los campos antes de realizar la inserción
  if (!numeroRequerimiento || !preguntasAuditadas || !desviacionOCriterio || 
    !responsableProblema || !local || !criticidad ||
    !accionesCorrectivas || !fechaRecepcionSolicitud || !fechaSolucionProgramada ||
    !estado || !contactoClientes || !auditor || !authToken) {
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
        authToken
      ]
    );

     // Configuración del correo electrónico
     const mailOptions = {
      from: 'contacto@fungilydev.com',
      to: correo, // Puedes modificar esto para enviar a otros correos si es necesario
      subject: `Nueva desviación creada - ${numeroRequerimiento}`,
      text: `
        Se ha creado una nueva desviación con los siguientes detalles:

        Número de Requerimiento: ${numeroRequerimiento}
        Preguntas Auditadas: ${preguntasAuditadas}
        Desviación o Criterio: ${desviacionOCriterio}
        Tipo de Acción: ${tipoDeAccion}
        Responsable del Problema: ${responsableProblema}
        Local: ${local}
        Criticidad: ${criticidad}
        Acciones Correctivas: ${accionesCorrectivas}
        Fecha de Recepción de la Solicitud: ${fechaRecepcionSolicitud}
        Fecha de Solución Programada: ${fechaSolucionProgramada}
        Estado: ${estado}
        Contacto Clientes: ${contactoClientes}
        Auditor: ${auditor}
        Fecha de Última Modificación: ${fechaUltimaModificacion}

        Por favor, revisa la información y toma las acciones necesarias.
      `,
    };

    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);

  } catch (error) {
    throw new Error('Error al almacenar los datos en la base de datos');
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

module.exports = {
  createDesviacion,
  getAllDesviaciones,
  updateDesviacion,
  deleteDesviacion
};



