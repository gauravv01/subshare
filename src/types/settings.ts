export interface Profile {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  country: string | null;
  language: string;
  timezone: string | null;
  notificationPreferences?: {
    emailNotifications: boolean;
    paymentReminders: boolean;
    newMemberAlerts: boolean;
    marketingEmails: boolean;
  };
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string | null;
  lastUsed: Date;
  isActive: boolean;
  isCurrent: boolean;
}

export interface BankDetails {
  id: string;
  type: 'CARD' | 'PAYPAL';
  cardNumber?: string;
  cardExpirationDate?: string;
  cardCvv?: string;
  provider?: string;
}

export interface WithdrawalMethod {
  id: string;
  type: 'BANK' | 'PAYPAL';
  provider: string;
  accountNumber?: string;
  routingNumber?: string;
  status: 'ACTIVE' | 'PENDING' | 'DISABLED';
} 