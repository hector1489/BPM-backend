const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const fs = require('fs');

const sendEmailWithExcel = async (toEmail, subject, text, data) => {
  console.log('Preparando opciones de correo...');
  
  // Generar el archivo de Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  
  // Guardar el archivo Excel en el sistema temporalmente
  const filePath = './data.xlsx';
  XLSX.writeFile(wb, filePath);

  // Configuramos las opciones de correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail || 'fungilydev@gmail.com',
    subject: subject || 'CBPFOOD AUDITORIA',
    text: text || 'Detalles de la desviación no proporcionados.',
    attachments: [
      {
        filename: 'data.xlsx',
        path: filePath,
      },
    ],
  };

  console.log('Opciones de correo configuradas:', mailOptions);

  try {
    console.log('Creando transportador de nodemailer...');
    
    // Crear el transportador con las credenciales de Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    // Verificar que el transportador esté configurado correctamente
    transporter.verify(function (error, success) {
      if (error) {
        console.error('Error al verificar el transportador:', error);
      } else {
        console.log('Servidor de correo listo para enviar mensajes.');
      }
    });

    console.log('Enviando correo...');
    
    // Enviar el correo con las opciones configuradas
    await transporter.sendMail(mailOptions);
    
    console.log('Correo enviado exitosamente.');
    
    // Eliminar el archivo temporal después de enviarlo
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};

module.exports = sendEmailWithExcel;
