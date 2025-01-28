import { supabase } from '../lib/supabase';
import type { Customer, NotificationEvent, EmailTemplate } from '../types';

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  pointsEarned: {
    id: 'points-earned',
    name: 'Puntos Ganados',
    subject: '¡Has ganado {{points}} puntos!',
    body: `
      Hola {{customerName}},
      
      ¡Acabas de ganar {{points}} puntos en {{storeName}}!
      
      Tu nuevo balance es: {{totalPoints}} puntos
      
      {{#if nextReward}}
      Te faltan solo {{pointsToNextReward}} puntos para tu próxima recompensa: {{nextRewardName}}
      {{/if}}
      
      Gracias por tu fidelidad,
      El equipo de {{storeName}}
    `,
    variables: ['points', 'customerName', 'storeName', 'totalPoints', 'nextReward', 'pointsToNextReward', 'nextRewardName']
  },
  tierUpgrade: {
    id: 'tier-upgrade',
    name: 'Nuevo Nivel VIP',
    subject: '¡Felicitaciones! Has alcanzado el nivel {{newTier}}',
    body: `
      ¡Felicitaciones {{customerName}}!
      
      Has alcanzado el nivel {{newTier}} en nuestro programa de fidelización.
      
      Tus nuevos beneficios incluyen:
      {{benefits}}
      
      Sigue disfrutando de tu experiencia VIP,
      El equipo de {{storeName}}
    `,
    variables: ['newTier', 'customerName', 'benefits', 'storeName']
  }
};

class NotificationService {
  async sendEmail(to: string, template: EmailTemplate, data: Record<string, any>) {
    const { data: store } = await supabase
      .from('stores')
      .select('email_settings')
      .single();

    const emailProvider = store.email_settings.provider;
    const emailConfig = store.email_settings.config;

    // Implementar lógica de envío según el proveedor
    switch (emailProvider) {
      case 'sendgrid':
        // Implementar SendGrid
        break;
      case 'mailgun':
        // Implementar Mailgun
        break;
      default:
        console.log('Email simulation:', { to, template, data });
    }
  }

  private compileTemplate(template: EmailTemplate, data: Record<string, any>) {
    let subject = template.subject;
    let body = template.body;

    template.variables.forEach(variable => {
      const value = data[variable] || '';
      const regex = new RegExp(`{{${variable}}}`, 'g');
      subject = subject.replace(regex, value);
      body = body.replace(regex, value);
    });

    return { subject, body };
  }

  async handleNotificationEvent(event: NotificationEvent) {
    const { customer, type, data } = event;

    if (!customer.notification_preferences[type]) {
      return;
    }

    const template = EMAIL_TEMPLATES[type];
    if (!template) {
      console.error(`No template found for event type: ${type}`);
      return;
    }

    const compiledTemplate = this.compileTemplate(template, {
      customerName: customer.name,
      storeName: 'Tu Tienda',
      ...data
    });

    await this.sendEmail(customer.email, template, compiledTemplate);
  }
}

export const notificationService = new NotificationService();