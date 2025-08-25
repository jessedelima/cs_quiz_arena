import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  const legalLinks = [
    { label: 'Termos de Serviço', href: '/terms' },
    { label: 'Política de Privacidade', href: '/privacy' },
    { label: 'Suporte', href: '/support' }
  ];

  const socialLinks = [
    { name: 'Discord', icon: 'MessageCircle', href: 'https://discord.gg/csquizarena' },
    { name: 'Twitter', icon: 'Twitter', href: 'https://twitter.com/csquizarena' },
    { name: 'YouTube', icon: 'Youtube', href: 'https://youtube.com/csquizarena' }
  ];

  return (
    <footer className="mt-16 pt-8 border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          {legalLinks?.map((link, index) => (
            <Link
              key={index}
              to={link?.href}
              className="text-sm text-muted-foreground hover:text-foreground gaming-transition"
            >
              {link?.label}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          {socialLinks?.map((social, index) => (
            <a
              key={index}
              href={social?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center gaming-transition hover:bg-primary hover:border-primary group"
              title={social?.name}
            >
              <Icon 
                name={social?.icon} 
                size={18} 
                color="var(--color-muted-foreground)"
                className="group-hover:text-primary-foreground"
              />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            © {currentYear} CS Quiz Arena. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Counter-Strike é uma marca registrada da Valve Corporation.
            Este site não é afiliado à Valve Corporation.
          </p>
        </div>

        {/* Age Restriction Notice */}
        <div className="flex items-center justify-center space-x-2 mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
          <span className="text-sm text-warning">
            Plataforma destinada a maiores de 18 anos
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;