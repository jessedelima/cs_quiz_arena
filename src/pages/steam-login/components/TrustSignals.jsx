import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const stats = [
    { label: 'Jogadores Ativos', value: '15.2K+', icon: 'Users' },
    { label: 'Quizzes Realizados', value: '89.5K+', icon: 'Brain' },
    { label: 'Prêmios Distribuídos', value: 'R$ 245K+', icon: 'Trophy' },
    { label: 'Taxa de Satisfação', value: '98.7%', icon: 'Star' }
  ];

  const testimonials = [
    {
      name: 'João Silva',
      role: 'Global Elite',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      comment: 'Finalmente uma plataforma que recompensa meu conhecimento sobre CS!'
    },
    {
      name: 'Maria Santos',
      role: 'Supreme Master',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      comment: 'Os quizzes são desafiadores e os prêmios são pagos rapidamente.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name={stat?.icon} size={20} color="var(--color-accent)" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials?.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={testimonial?.avatar}
                alt={testimonial?.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div>
                <div className="font-medium text-foreground">
                  {testimonial?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial?.role}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{testimonial?.comment}"
            </p>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span>Certificado SSL</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Lock" size={16} color="var(--color-success)" />
          <span>Steam OpenID</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="CheckCircle" size={16} color="var(--color-success)" />
          <span>Pagamentos Seguros</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;