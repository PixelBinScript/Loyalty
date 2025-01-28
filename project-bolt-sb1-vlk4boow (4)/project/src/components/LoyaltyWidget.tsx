import React, { useState } from 'react';
import { X, MessageCircle, Gift, Users, Share2, Crown } from 'lucide-react';
import type { Customer } from '../types';

const MOCK_CUSTOMER: Customer = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  points: 1500,
  tier: 'Silver',
  joinDate: new Date('2024-01-01'),
  referrals: 3
};

const LoyaltyWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'points' | 'vip' | 'referral' | 'ways'>('points');

  return (
    <>
      {/* Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Loyalty Pro</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="h-[500px] flex flex-col">
            {/* Customer Info */}
            <div className="p-4 bg-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-purple-700">
                    {MOCK_CUSTOMER.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{MOCK_CUSTOMER.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-purple-700">{MOCK_CUSTOMER.tier}</span>
                    <span className="text-sm text-gray-600">
                      {MOCK_CUSTOMER.points} puntos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex border-b">
              <TabButton
                active={activeTab === 'points'}
                onClick={() => setActiveTab('points')}
                icon={<Gift className="h-4 w-4" />}
                label="Puntos"
              />
              <TabButton
                active={activeTab === 'vip'}
                onClick={() => setActiveTab('vip')}
                icon={<Crown className="h-4 w-4" />}
                label="VIP"
              />
              <TabButton
                active={activeTab === 'referral'}
                onClick={() => setActiveTab('referral')}
                icon={<Users className="h-4 w-4" />}
                label="Referidos"
              />
              <TabButton
                active={activeTab === 'ways'}
                onClick={() => setActiveTab('ways')}
                icon={<Share2 className="h-4 w-4" />}
                label="Ganar"
              />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'points' && <PointsTab customer={MOCK_CUSTOMER} />}
              {activeTab === 'vip' && <VIPTab customer={MOCK_CUSTOMER} />}
              {activeTab === 'referral' && <ReferralTab customer={MOCK_CUSTOMER} />}
              {activeTab === 'ways' && <WaysToEarnTab />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 flex flex-col items-center space-y-1 text-sm ${
      active
        ? 'text-purple-600 border-b-2 border-purple-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const PointsTab: React.FC<{ customer: Customer }> = ({ customer }) => (
  <div className="space-y-4">
    <div className="text-center p-4 bg-purple-50 rounded-lg">
      <h3 className="text-2xl font-bold text-purple-600">{customer.points}</h3>
      <p className="text-sm text-gray-600">Puntos disponibles</p>
    </div>
    
    <div className="space-y-3">
      <h4 className="font-semibold">Recompensas Disponibles</h4>
      <RewardItem
        title="10% de descuento"
        points={1000}
        available={customer.points >= 1000}
      />
      <RewardItem
        title="Envío gratis"
        points={800}
        available={customer.points >= 800}
      />
      <RewardItem
        title="Producto gratis"
        points={2000}
        available={customer.points >= 2000}
      />
    </div>
  </div>
);

const VIPTab: React.FC<{ customer: Customer }> = ({ customer }) => (
  <div className="space-y-4">
    <div className="relative pt-2">
      <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-100">
        <div
          style={{ width: "60%" }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
        />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>Silver</span>
        <span>Gold</span>
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold">Beneficios VIP</h4>
      <VIPBenefit
        tier="Bronze"
        benefit="2% cashback en compras"
        active={customer.tier === 'Bronze'}
      />
      <VIPBenefit
        tier="Silver"
        benefit="5% cashback + envío gratis"
        active={customer.tier === 'Silver'}
      />
      <VIPBenefit
        tier="Gold"
        benefit="10% cashback + acceso anticipado"
        active={customer.tier === 'Gold'}
      />
      <VIPBenefit
        tier="Platinum"
        benefit="15% cashback + soporte prioritario"
        active={customer.tier === 'Platinum'}
      />
    </div>
  </div>
);

const ReferralTab: React.FC<{ customer: Customer }> = ({ customer }) => (
  <div className="space-y-4">
    <div className="bg-purple-50 p-4 rounded-lg text-center">
      <h3 className="text-2xl font-bold text-purple-600">{customer.referrals}</h3>
      <p className="text-sm text-gray-600">Referidos exitosos</p>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold">Tu link de referido</h4>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value="https://tienda.com/ref/juan123"
          readOnly
          className="flex-1 p-2 text-sm border rounded"
        />
        <button className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Copiar
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Gana 500 puntos por cada amigo que realice su primera compra
      </p>
    </div>
  </div>
);

const WaysToEarnTab: React.FC = () => (
  <div className="space-y-4">
    <h4 className="font-semibold">Formas de ganar puntos</h4>
    <div className="space-y-3">
      <EarnMethod
        title="Comprar"
        description="1 punto por cada $1 gastado"
        points={1}
      />
      <EarnMethod
        title="Referir amigos"
        description="500 puntos por referido"
        points={500}
      />
      <EarnMethod
        title="Seguir en redes"
        description="100 puntos por red social"
        points={100}
      />
      <EarnMethod
        title="Reseñar productos"
        description="50 puntos por reseña"
        points={50}
      />
      <EarnMethod
        title="Cumpleaños"
        description="Puntos dobles en tu cumpleaños"
        points={2}
        suffix="x"
      />
    </div>
  </div>
);

const RewardItem: React.FC<{
  title: string;
  points: number;
  available: boolean;
}> = ({ title, points, available }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <h5 className="font-medium">{title}</h5>
      <span className="text-sm text-gray-600">{points} puntos</span>
    </div>
    <button
      className={`px-3 py-1 rounded ${
        available
          ? 'bg-purple-600 text-white hover:bg-purple-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!available}
    >
      Canjear
    </button>
  </div>
);

const VIPBenefit: React.FC<{
  tier: string;
  benefit: string;
  active: boolean;
}> = ({ tier, benefit, active }) => (
  <div className={`p-3 rounded-lg ${active ? 'bg-purple-50' : 'bg-gray-50'}`}>
    <div className="flex items-center justify-between">
      <div>
        <h5 className="font-medium">{tier}</h5>
        <p className="text-sm text-gray-600">{benefit}</p>
      </div>
      {active && (
        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
          Actual
        </span>
      )}
    </div>
  </div>
);

const EarnMethod: React.FC<{
  title: string;
  description: string;
  points: number;
  suffix?: string;
}> = ({ title, description, points, suffix = 'pts' }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <h5 className="font-medium">{title}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-purple-600 font-semibold">
      {points}
      {suffix}
    </span>
  </div>
);

export default LoyaltyWidget;