import '@shopify/app-bridge-react';
import { createClient } from '@shopify/app-bridge';

export function initializeShopify(config: {
  apiKey: string;
  host: string;
  forceRedirect?: boolean;
}) {
  const client = createClient({
    apiKey: config.apiKey,
    host: config.host,
    forceRedirect: config.forceRedirect
  });

  return client;
}