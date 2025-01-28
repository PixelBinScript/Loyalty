import { supabase } from '../lib/supabase';
import { createShopifyAdmin } from '../lib/shopifyAdmin';

interface Store {
  id: string;
  name: string;
  shopify_domain: string;
  shopify_token: string;
  active: boolean;
}

class StoreService {
  async getStore(storeId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select()
      .eq('id', storeId)
      .single();

    if (error) throw error;
    return data as Store;
  }

  async setupShopifyIntegration(storeId: string) {
    const store = await this.getStore(storeId);
    const shopifyAdmin = createShopifyAdmin({
      shopDomain: store.shopify_domain,
      accessToken: store.shopify_token
    });

    // Instalar webhooks
    const webhooks = [
      { topic: 'orders/create', address: `${import.meta.env.VITE_API_URL}/webhooks/orders/create` },
      { topic: 'customers/create', address: `${import.meta.env.VITE_API_URL}/webhooks/customers/create` },
      { topic: 'app/uninstalled', address: `${import.meta.env.VITE_API_URL}/webhooks/app/uninstalled` }
    ];

    for (const webhook of webhooks) {
      await shopifyAdmin.createWebhook(webhook.topic, webhook.address);
    }

    // Instalar script del widget
    await shopifyAdmin.createScriptTag(
      `${import.meta.env.VITE_APP_URL}/widget.js`
    );

    // Actualizar estado de la tienda
    await supabase
      .from('stores')
      .update({
        active: true,
        setup_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', storeId);

    return { success: true };
  }

  async createDiscountCode(storeId: string, data: {
    code: string;
    value: number;
    type: 'percentage' | 'fixed_amount';
  }) {
    const store = await this.getStore(storeId);
    const shopifyAdmin = createShopifyAdmin({
      shopDomain: store.shopify_domain,
      accessToken: store.shopify_token
    });

    // Crear regla de precio
    const priceRule = await shopifyAdmin.createPriceRule({
      title: `Loyalty Reward - ${data.code}`,
      value: data.value,
      valueType: data.type,
      customerSelection: 'all',
      startsAt: new Date().toISOString()
    });

    // Crear código de descuento
    const discountCode = await shopifyAdmin.createDiscountCode(
      priceRule.price_rule.id,
      data.code
    );

    return discountCode;
  }
}

export const storeService = new StoreService();