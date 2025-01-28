import React from 'react';
import { Gift, Tag, Truck, Star } from 'lucide-react';
import type { Reward } from '../types';

const SAMPLE_REWARDS: Reward[] = [
  {
    id: '1',
    name: 'Descuento 10%',
    description: 'Obtén un 10% de descuento en tu próxima compra',
    pointsCost: 1000,
    type: 'discount',
    value: 10,
    available: true
  },
  {
    id: '2',
    name: 'Envío Gratis',
    description: 'Envío gratis en tu próximo pedido',
    pointsCost: 800,
    type: 'freeShipping',
    value: 0,
    available: true
  },
  {
    id: '3',
    name: 'Producto Gratis',
    description: 'Elige un producto de nuestra colección especial',
    pointsCost: 2000,
    type: 'freeProduct',
    value: 0,
    available: true
  }
];

const Rewards: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Recompensas</h1>
        <div className="flex space-x-4">
          <span className="text-lg font-medium">Tus puntos: 1,500</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_REWARDS.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>
    </div>
  );
};

const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => {
  const icons = {
    discount: <Tag className="h-6 w-6" />,
    freeShipping: <Truck className="h-6 w-6" />,
    freeProduct: <Gift className="h-6 w-6" />,
    exclusive: <Star className="h-6 w-6" />
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            {icons[reward.type]}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{reward.name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{reward.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-purple-600">
            {reward.pointsCost} puntos
          </span>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => alert('¡Recompensa canjeada!')}
          >
            Canjear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;