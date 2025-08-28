const nodemailer = require('nodemailer');

/**
 * Configuração do transporte de email
 * Em ambiente de desenvolvimento, usamos o serviço Ethereal para testes
 * Em produção, configure com seu provedor de email real
 */
async function createTransporter() {
  // Em ambiente de desenvolvimento, criar conta de teste no Ethereal
  if (process.env.NODE_ENV === 'development') {
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
  
  // Em produção, usar configurações reais
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/**
 * Envia email de confirmação de registro
 * @param {string} to - Email do destinatário
 * @param {string} confirmationUrl - URL de confirmação
 */
async function sendConfirmationEmail(to, confirmationUrl) {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: `"CS Quiz Arena" <${process.env.EMAIL_FROM || 'noreply@csquizarena.com'}>`,
      to,
      subject: 'Confirme seu email - CS Quiz Arena',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bem-vindo à CS Quiz Arena!</h2>
          <p>Obrigado por se registrar. Para completar seu cadastro, por favor confirme seu email clicando no botão abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmar Email</a>
          </div>
          
          <p>Se o botão acima não funcionar, você também pode copiar e colar o link abaixo no seu navegador:</p>
          <p style="word-break: break-all;">${confirmationUrl}</p>
          
          <p>Este link expirará em 24 horas.</p>
          
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #777; font-size: 12px;">
            Se você não solicitou este email, por favor ignore-o. Alguém pode ter inserido seu email por engano.
          </p>
        </div>
      `
    });
    
    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Email de confirmação enviado:');
      console.log('URL de visualização:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return false;
  }
}

/**
 * Envia email de redefinição de senha
 * @param {string} to - Email do destinatário
 * @param {string} resetUrl - URL de redefinição
 */
async function sendPasswordResetEmail(to, resetUrl) {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: `"CS Quiz Arena" <${process.env.EMAIL_FROM || 'noreply@csquizarena.com'}>`,
      to,
      subject: 'Redefinição de Senha - CS Quiz Arena',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de Senha</h2>
          <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Redefinir Senha</a>
          </div>
          
          <p>Se o botão acima não funcionar, você também pode copiar e colar o link abaixo no seu navegador:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          
          <p>Este link expirará em 1 hora.</p>
          
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #777; font-size: 12px;">
            Se você não solicitou a redefinição de senha, por favor ignore este email ou entre em contato com o suporte.
          </p>
        </div>
      `
    });
    
    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Email de redefinição de senha enviado:');
      console.log('URL de visualização:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error);
    return false;
  }
}

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail
};