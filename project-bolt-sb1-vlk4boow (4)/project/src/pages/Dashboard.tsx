import React from 'react';
import { Award, ShoppingBag, Users, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-500" />}
          title="Clientes Activos"
          value="1,234"
          change="+12%"
        />
        <StatCard
          icon={<ShoppingBag className="h-6 w-6 text-green-500" />}
          title="Puntos Otorgados"
          value="45,678"
          change="+8%"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-purple-500" />}
          title="Recompensas Canjeadas"
          value="567"
          change="+15%"
        />
        <StatCard
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          title="Nivel Promedio"
          value="Plata"
          change="+2 niveles"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <TopCustomers />
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}> = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <span className="text-green-500 text-sm font-semibold">{change}</span>
    </div>
    <h3 className="mt-4 text-gray-600 text-sm">{title}</h3>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const ActivityFeed: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start space-x-4">
          <div className="p-2 bg-purple-100 rounded-full">
            <ShoppingBag className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-900">Juan Pérez ganó 100 puntos</p>
            <p className="text-xs text-gray-500">Hace 2 horas</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopCustomers: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Mejores Clientes</h2>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">JP</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
              <p className="text-xs text-gray-500">1,234 puntos</p>
            </div>
          </div>
          <Award className="h-5 w-5 text-yellow-500" />
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;