const db = require('../database/db');
const moment = require('moment');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const formatDate = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
};


const sendGroupedEmail = async (safeValuesList) => {
  console.log('Iniciando envío de correo...');

  if (!safeValuesList.length) {
    console.error('Error: No hay desviaciones para enviar el correo.');
    return;
  }

  const recipientEmail = safeValuesList[0]?.correo?.trim() !== '' ? safeValuesList[0].correo : 'bbpmauditorias@gmail.com';

  console.log('Correo destinatario:', recipientEmail);

  if (!recipientEmail) {
    console.error('Error: No se ha definido un destinatario de correo.');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'BPM AUDITORIAS - Desviaciones Creación',
    text: generateEmailBody(safeValuesList)
  };

  console.log('Opciones del correo:', mailOptions);


  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};


const generateEmailBody = (desviaciones) => {
  console.log('Generando cuerpo del correo...');
  let body = `Se han creado las siguientes desviaciones:\n\n`;

  desviaciones.forEach((desviacion, index) => {
    body += `
    Desviación ${index + 1}:
    - Auditor: ${desviacion.auditor}
    - Número de Requerimiento: ${desviacion.numeroRequerimiento}\n\n`;
  });

  body += `Por favor, revisa el sistema para más detalles.`;
  console.log('Cuerpo del correo generado:', body);
  return body;
};


const handleEmptyField = (value) => {
  return value && value.trim() !== '' ? value : 'N/A';
};

const createDesviacion = async (desviacionesData) => {
  console.log('Iniciando creación de desviaciones...');
  const desviacionesArray = Array.isArray(desviacionesData) ? desviacionesData : [desviacionesData];

  const formatDate = (dateString) => {
    if (!dateString) return moment().format('YYYY-MM-DD');
    const formattedDate = moment(dateString, ['D/M/YYYY', 'YYYY-MM-DD'], true);
    return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : null;
  };

  const handleEmptyField = (field) => (field ? field : 'N/A');

  const safeValuesList = desviacionesArray.map((desviacion) => {
    return {
      numeroRequerimiento: handleEmptyField(desviacion.numeroRequerimiento),
      preguntasAuditadas: handleEmptyField(desviacion.preguntasAuditadas),
      desviacionOCriterio: handleEmptyField(desviacion.desviacionOCriterio),
      tipoDeAccion: handleEmptyField(desviacion.tipoDeAccion),
      responsableProblema: handleEmptyField(desviacion.responsableProblema),
      local: handleEmptyField(desviacion.local),
      criticidad: handleEmptyField(desviacion.criticidad),
      accionesCorrectivas: handleEmptyField(desviacion.accionesCorrectivas),
      fechaRecepcion: formatDate(desviacion.fechaRecepcionSolicitud),
      fechaSolucion: formatDate(desviacion.fechaSolucionProgramada),
      estado: handleEmptyField(desviacion.estado),
      fechaCambio: formatDate(desviacion.fechaCambioEstado),
      contactoClientes: handleEmptyField(desviacion.contactoClientes),
      evidenciaFotografica: handleEmptyField(desviacion.evidenciaFotografica),
      detalleFoto: handleEmptyField(desviacion.detalleFoto),
      auditor: handleEmptyField(desviacion.auditor),
      correo: handleEmptyField(desviacion.correo),
      fechaModificacion: formatDate(desviacion.fechaUltimaModificacion),
      authToken: desviacion.authToken || 'N/A',
    };
  });

  console.log('Lista de valores seguros:', safeValuesList);

  try {
    for (const safeValues of safeValuesList) {
      console.log('Insertando en la base de datos:', safeValues);

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
    }

    console.log('Insertado en la base de datos con éxito. Esperando antes de enviar correo...');

   
    console.log('Desviaciones creadas y correo enviado exitosamente.');
  } catch (error) {
    console.error('Error al almacenar los datos en la base de datos o enviar el correo:', error.message);
  }
};



const getAllDesviaciones = async () => {
  try {
    const results = await db(`SELECT * FROM desviaciones`);
    return results.rows;
  } catch (error) {
    throw new Error('Error al recuperar las desviaciones de la base de datos');
  }
};



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

  const fechaRecepcion = formatDate(fechaRecepcionSolicitud);
  const fechaSolucion = formatDate(fechaSolucionProgramada);
  const fechaCambio = formatDate(fechaCambioEstado);
  const fechaModificacion = formatDate(fechaUltimaModificacion);

  const safeValues = {
    numeroRequerimiento: handleEmptyField(numeroRequerimiento),
    preguntasAuditadas: handleEmptyField(preguntasAuditadas),
    desviacionOCriterio: handleEmptyField(desviacionOCriterio),
    tipoDeAccion: handleEmptyField(tipoDeAccion),
    responsableProblema: handleEmptyField(responsableProblema),
    local: handleEmptyField(local),
    criticidad: handleEmptyField(criticidad),
    accionesCorrectivas: handleEmptyField(accionesCorrectivas),
    estado: handleEmptyField(estado),
    contactoClientes: handleEmptyField(contactoClientes),
    evidenciaFotografica: handleEmptyField(evidenciaFotografica),
    detalleFoto: handleEmptyField(detalleFoto),
    auditor: handleEmptyField(auditor),
    correo: handleEmptyField(correo),
    authToken: handleEmptyField(authToken),
    fechaRecepcion,
    fechaSolucion,
    fechaCambio,
    fechaModificacion
  };

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
        safeValues.authToken,
        id
      ]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: safeValues.correo.trim() !== '' ? safeValues.correo : 'fungilydev@gmail.com',
      subject: 'Actualización de Desviación - BPM AUDITORIAS',
      text: `La desviación con el número de requerimiento: ${safeValues.numeroRequerimiento} ha sido actualizada.
      
      USUARIO: ${safeValues.auditor}

      Nuevos detalles de la desviación:
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
      
      Para ver más detalles, haz clic en el siguiente enlace:
        <a href="https://frontend-svc7.onrender.com/" target="_blank">Ver detalles de la auditoría</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de actualización enviado exitosamente.');



  } catch (error) {
    console.error('Error al actualizar la desviación:', error.message, 'Datos:', safeValues);
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
