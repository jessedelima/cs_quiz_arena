/**
 * Serviço de email para enviar emails de confirmação e outras notificações
 * Este é um serviço simulado que não envia emails reais
 */

/**
 * Envia um email de confirmação para o usuário registrado
 * @param {string} email - Email do destinatário
 * @param {string} username - Nome de usuário
 * @param {string} token - Token de confirmação
 * @returns {Promise} - Promise que resolve quando o email é "enviado"
 */
export const sendConfirmationEmail = async (email, username, token) => {
  // Simulação de envio de email
  console.log(`[EMAIL SERVICE] Enviando email de confirmação para ${email}`);
  
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Em um ambiente real, aqui seria a integração com um serviço de email como SendGrid, Mailgun, etc.
  const emailContent = {
    to: email,
    from: 'noreply@csquizarena.com',
    subject: 'Confirme seu email - CS Quiz Arena',
    body: `
      Olá ${username},
      
      Obrigado por se registrar no CS Quiz Arena!
      
      Para confirmar seu email e ativar sua conta, clique no link abaixo:
      
      http://localhost:4028/email-confirmation?token=${token}&email=${encodeURIComponent(email)}
      
      Este link expira em 24 horas.
      
      Se você não solicitou este email, por favor ignore-o.
      
      Atenciosamente,
      Equipe CS Quiz Arena
    `
  };
  
  console.log(`[EMAIL SERVICE] Email enviado com sucesso para ${email}`);
  console.log('[EMAIL SERVICE] Conteúdo do email:', emailContent);
  
  // Retornar sucesso simulado
  return {
    success: true,
    messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  };
};

/**
 * Envia um email de redefinição de senha
 * @param {string} email - Email do destinatário
 * @param {string} resetToken - Token de redefinição de senha
 * @returns {Promise} - Promise que resolve quando o email é "enviado"
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  // Simulação de envio de email
  console.log(`[EMAIL SERVICE] Enviando email de redefinição de senha para ${email}`);
  
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const emailContent = {
    to: email,
    from: 'noreply@csquizarena.com',
    subject: 'Redefinição de senha - CS Quiz Arena',
    body: `
      Olá,
      
      Recebemos uma solicitação para redefinir sua senha no CS Quiz Arena.
      
      Para redefinir sua senha, clique no link abaixo:
      
      http://localhost:4028/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}
      
      Este link expira em 1 hora.
      
      Se você não solicitou esta redefinição, por favor ignore este email.
      
      Atenciosamente,
      Equipe CS Quiz Arena
    `
  };
  
  console.log(`[EMAIL SERVICE] Email de redefinição enviado com sucesso para ${email}`);
  
  // Retornar sucesso simulado
  return {
    success: true,
    messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  };
};