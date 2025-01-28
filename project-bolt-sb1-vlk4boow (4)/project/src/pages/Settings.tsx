import React, { useState } from 'react';
import { Save, Mail, Gift, Crown, Users, Store, Palette } from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: <Store className="h-5 w-5" />,
      component: <GeneralSettings />
    },
    {
      id: 'points',
      title: 'Puntos y Recompensas',
      icon: <Gift className="h-5 w-5" />,
      component: <PointsSettings />
    },
    {
      id: 'tiers',
      title: 'Niveles VIP',
      icon: <Crown className="h-5 w-5" />,
      component: <TierSettings />
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: <Mail className="h-5 w-5" />,
      component: <NotificationSettings />
    },
    {
      id: 'referrals',
      title: 'Programa de Referidos',
      icon: <Users className="h-5 w-5" />,
      component: <ReferralSettings />
    },
    {
      id: 'appearance',
      title: 'Apariencia',
      icon: <Palette className="h-5 w-5" />,
      component: <AppearanceSettings />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {saved ? '¡Guardado!' : 'Guardar cambios'}
            </button>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === section.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {section.icon}
                  <span className="ml-3">{section.title}</span>
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 bg-white rounded-lg shadow">
              <div className="p-6">
                {sections.find(s => s.id === activeSection)?.component}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración General</h2>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la tienda
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="Mi Tienda"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Moneda
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="USD"
        >
          <option value="USD">USD - Dólar estadounidense</option>
          <option value="EUR">EUR - Euro</option>
          <option value="MXN">MXN - Peso mexicano</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Zona horaria
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="America/Mexico_City"
        >
          <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
          <option value="America/New_York">Nueva York (UTC-5)</option>
          <option value="Europe/Madrid">Madrid (UTC+1)</option>
        </select>
      </div>
    </div>
  </div>
);

const PointsSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Puntos y Recompensas</h2>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tasa de conversión de puntos
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            $1 =
          </span>
          <input
            type="number"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            defaultValue="1"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            puntos
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Puntos mínimos para canjear
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expiración de puntos
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="365"
        >
          <option value="never">Nunca expiran</option>
          <option value="180">6 meses</option>
          <option value="365">1 año</option>
          <option value="730">2 años</option>
        </select>
      </div>
    </div>
  </div>
);

const TierSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Niveles VIP</h2>
    
    {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, index) => (
      <div key={tier} className="border rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{tier}</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-500">Activo</label>
            <input
              type="checkbox"
              className="rounded text-purple-600 focus:ring-purple-500"
              defaultChecked
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Puntos requeridos
          </label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            defaultValue={[0, 1000, 2500, 5000][index]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Multiplicador de puntos
          </label>
          <input
            type="number"
            step="0.1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            defaultValue={[1, 1.2, 1.5, 2][index]}
          />
        </div>
      </div>
    ))}
  </div>
);

const NotificationSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h2>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proveedor de Email
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="sendgrid"
        >
          <option value="sendgrid">SendGrid</option>
          <option value="mailgun">Mailgun</option>
          <option value="ses">Amazon SES</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email del remitente
        </label>
        <input
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="rewards@mitienda.com"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Notificaciones automáticas</h3>
        
        {[
          'Puntos ganados',
          'Cambios de nivel',
          'Recompensas canjeadas',
          'Referidos exitosos',
          'Recordatorio de puntos por expirar',
          'Cumpleaños'
        ].map(notification => (
          <div key={notification} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{notification}</span>
            <input
              type="checkbox"
              className="rounded text-purple-600 focus:ring-purple-500"
              defaultChecked
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReferralSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Programa de Referidos</h2>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Puntos por referido
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Puntos para el referido
        </label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="250"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Compra mínima para validar referido
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            $
          </span>
          <input
            type="number"
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            defaultValue="50"
          />
        </div>
      </div>
    </div>
  </div>
);

const AppearanceSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Apariencia</h2>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color primario
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <input
            type="color"
            className="h-8 w-8 rounded-md border border-gray-300"
            defaultValue="#9333EA"
          />
          <input
            type="text"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            defaultValue="#9333EA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Posición del widget
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="bottom-right"
        >
          <option value="bottom-right">Inferior derecha</option>
          <option value="bottom-left">Inferior izquierda</option>
          <option value="top-right">Superior derecha</option>
          <option value="top-left">Superior izquierda</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Idioma predeterminado
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue="es"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vista previa del widget
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          [Vista previa del widget aquí]
        </div>
      </div>
    </div>
  </div>
);

export default Settings;