const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail || 'fungilydev@gmail.com',
    subject: subject || 'BPM AUDITORIAS',
    text: text || 'Detalles de la desviación no proporcionados.'
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente.');
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};

module.exports = sendEmail;
