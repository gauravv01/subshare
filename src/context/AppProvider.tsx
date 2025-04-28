import React from 'react';
import { ProfileProvider } from './ProfileProvider';
import { SecurityProvider } from './SecurityProvider';
import { SessionProvider } from './SessionProvider';
import { BankProvider } from './BankProvider';
import { NotificationProvider } from './NotificationProvider';
import { PaymentProvider } from './PaymentProvider';
import { SubscriptionProvider } from './SubscriptionProvider';
import { ServiceProvider } from './ServiceProvider';
import { MemberProvider } from './MemberProvider';
import { MessageProvider } from './MessageProvider';
import { TransactionProvider } from './TransactionProvider';
import { ReviewProvider } from './ReviewProvider';
import { AuthProvider } from './AuthProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>  
    <ProfileProvider>
      <SecurityProvider>
        <SessionProvider>
          <BankProvider>
            <NotificationProvider>
              <PaymentProvider>
                <SubscriptionProvider>
                  <ServiceProvider>
                    <MemberProvider>
                      <MessageProvider>
                        <TransactionProvider>
                          <ReviewProvider>
                            {children}
                          </ReviewProvider>
                        </TransactionProvider>
                      </MessageProvider>
                    </MemberProvider>
                  </ServiceProvider>
                </SubscriptionProvider>
              </PaymentProvider>
            </NotificationProvider>
          </BankProvider>
        </SessionProvider>
      </SecurityProvider>
    </ProfileProvider>
    </AuthProvider>
  );
}; 