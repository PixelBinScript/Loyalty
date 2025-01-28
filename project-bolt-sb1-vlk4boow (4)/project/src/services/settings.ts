import { supabase } from '../lib/supabase';

class SettingsService {
  async getSettings(storeId: string) {
    const { data, error } = await supabase
      .from('settings')
      .select()
      .eq('store_id', storeId);

    if (error) throw error;

    // Convertir array de configuraciones a objeto
    return data.reduce((acc, setting) => ({
      ...acc,
      [setting.key]: setting.value
    }), {});
  }

  async updateSetting(storeId: string, key: string, value: any) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        store_id: storeId,
        key,
        value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSettings(storeId: string, settings: Record<string, any>) {
    const updates = Object.entries(settings).map(([key, value]) => ({
      store_id: storeId,
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('settings')
      .upsert(updates)
      .select();

    if (error) throw error;
    return data;
  }
}

export const settingsService = new SettingsService();