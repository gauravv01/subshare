import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';


interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  cycle: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  isOwner: boolean;
  members: Member[];
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, isOwner, members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscription.name}</CardTitle>
      </CardHeader> 
      <CardContent>
        <p>{subscription.description}</p>
        <p>Price: ${subscription.price}</p>
        <p>Cycle: {subscription.cycle}</p>
        <p>Members: {members.length}</p>
        <p>Owner: {isOwner ? "Yes" : "No"}</p>
      </CardContent>
    </Card>
  );
};

    