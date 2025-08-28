const nodemailer = require('nodemailer');
const { generateVerificationToken, generatePasswordResetToken } = require('../utils/tokenUtils');
const logger = require('../utils/logger').logger;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Configuração para diferentes provedores
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      };

      // Configurações específicas para provedores populares
      if (process.env.EMAIL_PROVIDER === 'gmail') {
        emailConfig.service = 'gmail';
        emailConfig.host = 'smtp.gmail.com';
        emailConfig.port = 587;
        emailConfig.secure = false;
      } else if (process.env.EMAIL_PROVIDER === 'outlook') {
        emailConfig.service = 'hotmail';
        emailConfig.host = 'smtp-mail.outlook.com';
        emailConfig.port = 587;
        emailConfig.secure = false;
      } else if (process.env.EMAIL_PROVIDER === 'sendgrid') {
        emailConfig.host = 'smtp.sendgrid.net';
        emailConfig.port = 587;
        emailConfig.secure = false;
        emailConfig.auth.user = 'apikey';
      }

      this.transporter = nodemailer.createTransporter(emailConfig);
      
      // Verificar conexão
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error('Erro na configuração do email:', error);
        } else {
          logger.info('Servidor de email configurado com sucesso');
        }
      });
      
    } catch (error) {
      logger.error('Erro ao inicializar transporter de email:', error);
    }
  }

  /**
   * Envia email de verificação para novo usuário
   */
  async sendVerificationEmail(email, userId) {
    try {
      const token = generateVerificationToken(userId);
      const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
      
      const mailOptions = {
        from: {
          name: 'CS Quiz Arena',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: 'Verifique sua conta - CS Quiz Arena',
        html: this.getVerificationEmailTemplate(verificationUrl),
        text: `Bem-vindo ao CS Quiz Arena! Clique no link para verificar sua conta: ${verificationUrl}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email de verificação enviado para ${email}`, { messageId: result.messageId });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Erro ao enviar email de verificação:', error);
      throw new Error('Falha ao enviar email de verificação');
    }
  }

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(email, userId) {
    try {
      const token = generatePasswordResetToken(userId);
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
      
      const mailOptions = {
        from: {
          name: 'CS Quiz Arena',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: 'Redefinir senha - CS Quiz Arena',
        html: this.getPasswordResetEmailTemplate(resetUrl),
        text: `Clique no link para redefinir sua senha: ${resetUrl}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email de reset de senha enviado para ${email}`, { messageId: result.messageId });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Erro ao enviar email de reset de senha:', error);
      throw new Error('Falha ao enviar email de reset de senha');
    }
  }

  /**
   * Envia email de boas-vindas após verificação
   */
  async sendWelcomeEmail(email, username) {
    try {
      const mailOptions = {
        from: {
          name: 'CS Quiz Arena',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: 'Bem-vindo ao CS Quiz Arena!',
        html: this.getWelcomeEmailTemplate(username),
        text: `Bem-vindo ao CS Quiz Arena, ${username}! Sua conta foi verificada com sucesso.`
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email de boas-vindas enviado para ${email}`, { messageId: result.messageId });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Erro ao enviar email de boas-vindas:', error);
      // Não lançar erro aqui, pois é um email secundário
      return { success: false, error: error.message };
    }
  }

  /**
   * Envia notificação de torneio
   */
  async sendTournamentNotification(email, username, tournamentData) {
    try {
      const mailOptions = {
        from: {
          name: 'CS Quiz Arena',
          address: process.env.SMTP_FROM || process.env.SMTP_USER
        },
        to: email,
        subject: `Torneio ${tournamentData.name} - CS Quiz Arena`,
        html: this.getTournamentEmailTemplate(username, tournamentData),
        text: `Olá ${username}, o torneio ${tournamentData.name} está começando!`
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email de torneio enviado para ${email}`, { messageId: result.messageId });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Erro ao enviar email de torneio:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Template para email de verificação
   */
  getVerificationEmailTemplate(verificationUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificar Conta - CS Quiz Arena</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎮 CS Quiz Arena</h1>
                <p>Bem-vindo à melhor plataforma de quiz de Counter-Strike!</p>
            </div>
            <div class="content">
                <h2>Verifique sua conta</h2>
                <p>Obrigado por se registrar no CS Quiz Arena! Para completar seu cadastro e começar a participar dos torneios, clique no botão abaixo:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verificar Conta</a>
                </div>
                
                <p>Ou copie e cole este link no seu navegador:</p>
                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
                
                <p><strong>Este link expira em 24 horas.</strong></p>
                
                <p>Se você não criou esta conta, pode ignorar este email.</p>
            </div>
            <div class="footer">
                <p>© 2024 CS Quiz Arena. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Template para email de reset de senha
   */
  getPasswordResetEmailTemplate(resetUrl) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - CS Quiz Arena</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 CS Quiz Arena</h1>
                <p>Redefinição de Senha</p>
            </div>
            <div class="content">
                <h2>Redefinir sua senha</h2>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Redefinir Senha</a>
                </div>
                
                <p>Ou copie e cole este link no seu navegador:</p>
                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
                
                <p><strong>Este link expira em 1 hora por segurança.</strong></p>
                
                <p>Se você não solicitou esta redefinição, pode ignorar este email. Sua senha permanecerá inalterada.</p>
            </div>
            <div class="footer">
                <p>© 2024 CS Quiz Arena. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Template para email de boas-vindas
   */
  getWelcomeEmailTemplate(username) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo - CS Quiz Arena</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2ecc71; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Bem-vindo, ${username}!</h1>
                <p>Sua conta foi verificada com sucesso!</p>
            </div>
            <div class="content">
                <h2>Pronto para começar?</h2>
                <p>Agora você pode aproveitar todas as funcionalidades do CS Quiz Arena:</p>
                
                <div class="feature">
                    <h3>🏆 Torneios Diários</h3>
                    <p>Participe de torneios automáticos 24/7 e ganhe prêmios incríveis!</p>
                </div>
                
                <div class="feature">
                    <h3>🎯 Quiz Personalizado</h3>
                    <p>Teste seus conhecimentos sobre Counter-Strike com perguntas atualizadas.</p>
                </div>
                
                <div class="feature">
                    <h3>💰 Sistema de Recompensas</h3>
                    <p>Ganhe XP, suba de nível e desbloqueie conquistas exclusivas.</p>
                </div>
                
                <div class="feature">
                    <h3>👥 Comunidade Ativa</h3>
                    <p>Conecte-se com outros jogadores e forme equipes para torneios.</p>
                </div>
                
                <p style="text-align: center; margin-top: 30px;">
                    <strong>Que tal começar com seu primeiro quiz?</strong>
                </p>
            </div>
            <div class="footer">
                <p>© 2024 CS Quiz Arena. Todos os direitos reservados.</p>
                <p>Precisa de ajuda? Entre em contato conosco!</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Template para notificação de torneio
   */
  getTournamentEmailTemplate(username, tournamentData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Torneio ${tournamentData.name} - CS Quiz Arena</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tournament-info { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #f39c12; }
            .button { display: inline-block; background: #f39c12; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏆 ${tournamentData.name}</h1>
                <p>Um novo torneio está começando!</p>
            </div>
            <div class="content">
                <h2>Olá, ${username}!</h2>
                <p>Um torneio que pode interessar você está prestes a começar:</p>
                
                <div class="tournament-info">
                    <h3>${tournamentData.name}</h3>
                    <p><strong>Prêmio:</strong> ${tournamentData.prize || 'A definir'}</p>
                    <p><strong>Taxa de Entrada:</strong> ${tournamentData.entryFee || 'Gratuito'}</p>
                    <p><strong>Início:</strong> ${tournamentData.startTime || 'Em breve'}</p>
                    <p><strong>Participantes:</strong> ${tournamentData.maxParticipants || 'Ilimitado'}</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}/tournaments/${tournamentData.id}" class="button">Participar Agora</a>
                </div>
                
                <p>Não perca esta oportunidade de mostrar seus conhecimentos e ganhar prêmios incríveis!</p>
            </div>
            <div class="footer">
                <p>© 2024 CS Quiz Arena. Todos os direitos reservados.</p>
                <p>Para parar de receber estas notificações, acesse suas configurações de conta.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();