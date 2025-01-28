import { supabase } from '../lib/supabase';
import type { Customer, Activity, NotificationEvent } from '../types';
import { notificationService } from './notifications';

class LoyaltyService {
  private calculateTier(points: number): Customer['tier'] {
    if (points >= 5000) return 'Platinum';
    if (points >= 2500) return 'Gold';
    if (points >= 1000) return 'Silver';
    return 'Bronze';
  }

  async addPoints(customerId: string, points: number, activity: Omit<Activity, 'id' | 'date'>) {
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select()
      .eq('id', customerId)
      .single();

    if (customerError) throw customerError;

    const oldTier = customer.tier;
    const newPoints = customer.points + points;
    const newTier = this.calculateTier(newPoints);

    // Actualizar puntos del cliente
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        points: newPoints,
        tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Registrar actividad
    const { data: newActivity, error: activityError } = await supabase
      .from('activities')
      .insert({
        customer_id: customerId,
        points,
        type: activity.type,
        description: activity.description
      })
      .select()
      .single();

    if (activityError) throw activityError;

    // Notificar puntos ganados
    const pointsEvent: NotificationEvent = {
      type: 'pointsEarned',
      customer: updatedCustomer,
      data: {
        points,
        totalPoints: newPoints,
        activity: newActivity
      }
    };
    await notificationService.handleNotificationEvent(pointsEvent);

    // Notificar cambio de nivel si aplica
    if (newTier !== oldTier) {
      const tierEvent: NotificationEvent = {
        type: 'tierUpgrade',
        customer: updatedCustomer,
        data: {
          oldTier,
          newTier,
          benefits: this.getTierBenefits(newTier)
        }
      };
      await notificationService.handleNotificationEvent(tierEvent);
    }

    return { updatedCustomer, newActivity };
  }

  private getTierBenefits(tier: Customer['tier']): string[] {
    const benefits = {
      Bronze: [
        '2% cashback en compras',
        'Acceso a recompensas básicas'
      ],
      Silver: [
        '5% cashback en compras',
        'Envío gratis en pedidos +$50',
        'Acceso anticipado a ofertas'
      ],
      Gold: [
        '10% cashback en compras',
        'Envío gratis sin mínimo',
        'Acceso anticipado a ofertas',
        'Soporte prioritario'
      ],
      Platinum: [
        '15% cashback en compras',
        'Envío gratis express',
        'Acceso anticipado a ofertas',
        'Soporte VIP 24/7',
        'Regalos sorpresa mensuales'
      ]
    };

    return benefits[tier];
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No se encontró el cliente
      throw error;
    }

    return data;
  }

  async getReward(rewardId: string) {
    const { data, error } = await supabase
      .from('rewards')
      .select()
      .eq('id', rewardId)
      .single();

    if (error) throw error;
    return data;
  }

  async redeemReward(customerId: string, rewardId: string) {
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select()
      .eq('id', customerId)
      .single();

    if (customerError) throw customerError;

    const reward = await this.getReward(rewardId);
    if (!reward || customer.points < reward.points_cost) {
      throw new Error('Insufficient points');
    }

    // Generar código único para la recompensa
    const rewardCode = this.generateRewardCode();

    // Actualizar puntos del cliente
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        points: customer.points - reward.points_cost,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Registrar actividad
    await supabase
      .from('activities')
      .insert({
        customer_id: customerId,
        type: 'redemption',
        points: -reward.points_cost,
        description: `Canjeó ${reward.name}`
      });

    // Notificar redención
    const redeemEvent: NotificationEvent = {
      type: 'rewardRedeemed',
      customer: updatedCustomer,
      data: {
        rewardName: reward.name,
        rewardCode,
        rewardInstructions: this.getRewardInstructions(reward)
      }
    };
    await notificationService.handleNotificationEvent(redeemEvent);

    return { updatedCustomer, rewardCode };
  }

  private generateRewardCode(): string {
    return `RWD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private getRewardInstructions(reward: any): string {
    return `Para usar tu ${reward.name}, ingresa el código durante el checkout.`;
  }
}

export const loyaltyService = new LoyaltyService();