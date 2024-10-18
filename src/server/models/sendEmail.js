const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, subject, text) => {
  console.log('Preparando opciones de correo...');
  
  // Configuramos las opciones de correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail || 'bbpmauditorias@gmail.com',
    subject: subject || 'BPM AUDITORIAS',
    text: text || 'Detalles de la desviación no proporcionados.'
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
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};

module.exports = sendEmail;
