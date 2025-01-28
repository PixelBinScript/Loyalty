import React, { useState } from 'react';
import { Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { storeService } from '../services/store';

interface SetupStatus {
  webhooks: boolean;
  scriptTag: boolean;
  error?: string;
}

const ShopifySetup: React.FC<{ storeId: string }> = ({ storeId }) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [status, setStatus] = useState<SetupStatus>({
    webhooks: false,
    scriptTag: false
  });

  const handleConfigure = async () => {
    setIsConfiguring(true);
    try {
      await storeService.setupShopifyIntegration(storeId);
      setStatus({
        webhooks: true,
        scriptTag: true
      });
    } catch (error) {
      console.error('Error configuring Shopify:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Error al configurar la integración'
      }));
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold">Configuración de Shopify</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Configura la integración con tu tienda Shopify para comenzar a otorgar puntos por compras.
        </p>

        {status.error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <p>{status.error}</p>
          </div>
        )}

        <div className="space-y-3">
          <SetupItem
            title="Webhooks"
            description="Necesarios para procesar órdenes y clientes"
            done={status.webhooks}
          />
          
          <SetupItem
            title="Widget de Puntos"
            description="Script para mostrar los puntos a tus clientes"
            done={status.scriptTag}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleConfigure}
            disabled={isConfiguring}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isConfiguring ? 'Configurando...' : 'Configurar Todo'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SetupItem: React.FC<{
  title: string;
  description: string;
  done: boolean;
}> = ({ title, description, done }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      {done ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
      )}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

export default ShopifySetup;