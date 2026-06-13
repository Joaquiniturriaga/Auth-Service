const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  console.log('>>> Intentando enviar a:', toEmail);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    const info = await transporter.sendMail({
      from: `"Valle del Sol 🔥" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: 'Recuperar contraseña — Valle del Sol',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;">
          <h2 style="color: #e25822;">Recuperar contraseña</h2>
          <p>Haz clic en el enlace para restablecer tu contraseña. Expira en <strong>1 hora</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block; margin: 16px 0; padding: 12px 24px;
                    background:#e25822; color:#fff; border-radius:6px;
                    text-decoration:none; font-weight:bold;">
            Restablecer contraseña
          </a>
          <p style="color:#888; font-size:12px;">Si no solicitaste esto, ignora este email.</p>
        </div>
      `,
    });
    console.log('>>> Email enviado OK:', info.messageId);
  } catch (err) {
    console.error('>>> ERROR sendMail:', err.message);
    throw err;
  }
};

module.exports = { sendPasswordResetEmail };