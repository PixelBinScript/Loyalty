export interface Customer {
  id: string;
  email: string;
  name: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: Date;
  lastPurchase?: Date;
  referrals: number;
  notificationPreferences: {
    pointsUpdates: boolean;
    tierUpdates: boolean;
    rewards: boolean;
    referrals: boolean;
    promotions: boolean;
  };
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeProduct' | 'freeShipping' | 'exclusive';
  value: number;
  available: boolean;
}

export interface Activity {
  id: string;
  customerId: string;
  type: 'purchase' | 'referral' | 'review' | 'social' | 'redemption';
  points: number;
  date: Date;
  description: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface NotificationEvent {
  type: 'pointsEarned' | 'tierUpgrade' | 'rewardRedeemed' | 'referralSuccess' | 'birthdayComing';
  customer: Customer;
  data: Record<string, any>;
}