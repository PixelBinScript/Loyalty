import { supabase } from '../lib/supabase';
import { loyaltyService } from './loyalty';
import { settingsService } from './settings';

interface ShopifyOrder {
  id: number;
  email: string;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  total_price: string;
  order_number: number;
  created_at: string;
}

class ShopifyService {
  async handleWebhook(topic: string, data: any, storeId: string) {
    switch (topic) {
      case 'orders/create':
        await this.handleOrderCreated(data as ShopifyOrder, storeId);
        break;
      case 'customers/create':
        await this.handleCustomerCreated(data, storeId);
        break;
      case 'app/uninstalled':
        await this.handleAppUninstalled(storeId);
        break;
    }
  }

  private async handleOrderCreated(order: ShopifyOrder, storeId: string) {
    try {
      // Obtener configuración de puntos
      const settings = await settingsService.getSettings(storeId);
      const pointsRate = settings.points_rate || 1; // Puntos por cada $1

      // Buscar o crear cliente
      let customer = await loyaltyService.getCustomerByEmail(order.customer.email);
      
      if (!customer) {
        const { data, error } = await supabase
          .from('customers')
          .insert({
            email: order.customer.email,
            name: `${order.customer.first_name} ${order.customer.last_name}`.trim(),
            points: 0,
            tier: 'Bronze'
          })
          .select()
          .single();

        if (error) throw error;
        customer = data;
      }

      // Calcular puntos
      const orderTotal = parseFloat(order.total_price);
      const pointsEarned = Math.floor(orderTotal * pointsRate);

      // Agregar puntos
      await loyaltyService.addPoints(customer.id, pointsEarned, {
        customerId: customer.id,
        type: 'purchase',
        points: pointsEarned,
        description: `Compra #${order.order_number}`
      });
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  }

  private async handleCustomerCreated(customer: any, storeId: string) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          email: customer.email,
          name: `${customer.first_name} ${customer.last_name}`.trim(),
          points: 0,
          tier: 'Bronze'
        })
        .select()
        .single();

      if (error) throw error;

      // Otorgar puntos de bienvenida si está configurado
      const settings = await settingsService.getSettings(storeId);
      const welcomePoints = settings.welcome_points || 0;

      if (welcomePoints > 0) {
        await loyaltyService.addPoints(data.id, welcomePoints, {
          customerId: data.id,
          type: 'welcome',
          points: welcomePoints,
          description: 'Puntos de bienvenida'
        });
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  private async handleAppUninstalled(storeId: string) {
    try {
      // Marcar la tienda como inactiva
      await settingsService.updateSetting(storeId, 'active', false);
    } catch (error) {
      console.error('Error handling app uninstall:', error);
      throw error;
    }
  }

  async createDiscountCode(storeId: string, data: {
    code: string;
    value: number;
    type: 'percentage' | 'fixed_amount';
  }) {
    // Aquí iría la lógica para crear un código de descuento en Shopify
    // usando la API de Shopify Admin
  }

  async installScriptTag(storeId: string) {
    // Aquí iría la lógica para instalar el script del widget
    // usando la API de Shopify Admin
  }
}

export const shopifyService = new ShopifyService();