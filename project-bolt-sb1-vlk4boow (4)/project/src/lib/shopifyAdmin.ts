import { supabase } from './supabase';

interface ShopifyAdminConfig {
  shopDomain: tumatera.co;
  accessToken: string;
}

class ShopifyAdmin {
  private config: ShopifyAdminConfig;

  constructor(config: ShopifyAdminConfig) {
    this.config = config;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.config.shopDomain}/admin/api/2024-01${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.config.accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createWebhook(topic: string, address: string) {
    return this.fetch('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: 'json'
        }
      })
    });
  }

  async createScriptTag(src: string) {
    return this.fetch('/script_tags.json', {
      method: 'POST',
      body: JSON.stringify({
        script_tag: {
          event: 'onload',
          src,
          display_scope: 'online_store'
        }
      })
    });
  }

  async createPriceRule(data: {
    title: string;
    value: number;
    valueType: 'fixed_amount' | 'percentage';
    customerSelection: 'all' | 'prerequisite';
    startsAt: string;
    endsAt?: string;
  }) {
    return this.fetch('/price_rules.json', {
      method: 'POST',
      body: JSON.stringify({
        price_rule: {
          title: data.title,
          target_type: 'line_item',
          target_selection: 'all',
          allocation_method: 'across',
          value_type: data.valueType,
          value: `-${data.value}`,
          customer_selection: data.customerSelection,
          starts_at: data.startsAt,
          ends_at: data.endsAt,
        }
      })
    });
  }

  async createDiscountCode(priceRuleId: string, code: string) {
    return this.fetch(`/price_rules/${priceRuleId}/discount_codes.json`, {
      method: 'POST',
      body: JSON.stringify({
        discount_code: {
          code
        }
      })
    });
  }
}

export function createShopifyAdmin(config: ShopifyAdminConfig) {
  return new ShopifyAdmin(config);
}