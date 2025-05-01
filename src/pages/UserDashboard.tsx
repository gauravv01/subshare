import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { useToast } from "../hooks/use-toast";
import { useSubscriptions } from "../context/SubscriptionProvider";
import { useTransactions } from "../context/TransactionProvider";
import { useMembers } from "../context/MemberProvider";
import { useAuth } from "../context/AuthProvider";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  User,
  PlusCircle,
  Clock,
  CreditCard,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function UserDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    subscriptions, 
    ownedSubscriptions, 
    memberSubscriptions, 
    fetchSubscriptions, 
    isLoading: subscriptionsLoading 
  } = useSubscriptions();
  const { 
    transactions, 
    fetchTransactions, 
    isLoading: transactionsLoading 
  } = useTransactions();
  const {
    members,
    fetchMembers,
    isLoading: membersLoading
  } = useMembers();
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // First fetch subscriptions
        await fetchSubscriptions();
        await fetchTransactions();
        
        // Then fetch members for each subscription
        if (subscriptions.length > 0) {
          // Create an array of promises for fetching members
          const memberPromises = subscriptions.map(sub => 
            fetchMembers(sub.id)
          );
          await Promise.all(memberPromises);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate financial metrics
  const monthlyRevenue = transactions
    .filter(t => t.type === 'PAYOUT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'PAYMENT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netMonthlyBalance = monthlyRevenue - monthlyExpenses;
  
  // Calculate traditional cost (if paid individually)
  const traditionalCost = ownedSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
  
  // Calculate annual savings/profit
  const annualSavingsProfit = netMonthlyBalance * 12;



  return (
    <DashboardLayout >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                setIsLoading(true);
                try {
                  await fetchSubscriptions();
                  await fetchTransactions();
                  
                  if (subscriptions.length > 0) {
                    const memberPromises = subscriptions.map(sub => 
                      fetchMembers(sub.id)
                    );
                    await Promise.all(memberPromises);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button asChild>
              <Link to="/create-subscription">
                <Plus className="mr-2 h-4 w-4" /> Create Subscription
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="joined-subscriptions">Joined Subscriptions</TabsTrigger>
            <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscriptions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {ownedSubscriptions.length} owned, {memberSubscriptions.length} joined
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    On subscription memberships
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From subscription sharing
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netMonthlyBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {netMonthlyBalance >= 0 ? '+' : ''}{netMonthlyBalance.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Monthly profit/loss
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Owned Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle>My Owned Subscriptions</CardTitle>
                <CardDescription>Subscriptions you're sharing with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionsLoading ? (
                  <div className="text-center py-8">Loading subscriptions...</div>
                ) : ownedSubscriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't own any subscriptions yet.
                    <div className="mt-4">
                      <Button asChild>
                        <Link to="/create-subscription">Create Subscription</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ownedSubscriptions.map(subscription => {
                      const subscriptionMembers = members.filter(m => m.subscriptionId === subscription.id);
                      const filledSeats = subscriptionMembers.length;
                      const capacityPercentage = (filledSeats / subscription.maxMembers) * 100;
                      
                      return (
                        <div key={subscription.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">{subscription.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {subscription.service?.name || 'Custom Subscription'}
                              </p>
                            </div>
                            <Badge 
                              className={
                                subscription.status === 'ACTIVE' 
                                  ? 'bg-green-50 text-green-700' 
                                  : subscription.status === 'PAUSED' 
                                    ? 'bg-yellow-50 text-yellow-700' 
                                    : 'bg-red-50 text-red-700'
                              }
                            >
                              {subscription.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Subscription Cost</p>
                              <p className="font-medium">${subscription.price}/{subscription.cycle.toLowerCase()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Members</p>
                              <p className="font-medium">{filledSeats}/{subscription.maxMembers} seats filled</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Per-Member Price</p>
                              <p className="font-medium">
                                ${(subscription.price / subscription.maxMembers).toFixed(2)}/{subscription.cycle.toLowerCase()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Capacity</span>
                              <span>{Math.round(capacityPercentage)}%</span>
                            </div>
                            <Progress value={capacityPercentage} />
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/manage-members`}>Manage</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Joined Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions I've Joined</CardTitle>
                <CardDescription>Subscriptions shared by others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionsLoading ? (
                  <div className="text-center py-8">Loading subscriptions...</div>
                ) : memberSubscriptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't joined any subscriptions yet.
                    <div className="mt-4">
                      <Button asChild>
                        <Link to="/connect">Browse Subscriptions</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {memberSubscriptions.map(subscription => {
                      const membership = members.find(m => 
                        m.subscriptionId === subscription.id && m.userId === user?.id
                      );
                      
                      return (
                        <div key={subscription.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">{subscription.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {subscription.service?.name || 'Custom Subscription'}
                              </p>
                            </div>
                            <Badge 
                              className={
                                membership?.status === 'ACTIVE' 
                                  ? 'bg-green-50 text-green-700' 
                                  : membership?.status === 'PENDING' 
                                    ? 'bg-yellow-50 text-yellow-700' 
                                    : 'bg-red-50 text-red-700'
                              }
                            >
                              {membership?.status || 'Unknown'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Your Cost</p>
                              <p className="font-medium">
                                ${(subscription.price / subscription.maxMembers).toFixed(2)}/{subscription.cycle.toLowerCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Owner</p>
                              <p className="font-medium">
                                {subscription.members.find(m => m.role === 'ADMIN')?.user.name || 'Unknown'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Next Payment</p>
                              <p className="font-medium">
                                  {membership?.nextPaymentDate 
                                  ? format(new Date(membership.nextPaymentDate), 'MMM d, yyyy')
                                  : 'Not scheduled'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/manage-members`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Summary Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Your subscription sharing economy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Revenue</h3>
                      <p className="text-xl font-bold text-green-600">+${monthlyRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Expenses</h3>
                      <p className="text-xl font-bold text-red-500">-${monthlyExpenses.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Net Monthly Balance</h3>
                      <p className={`text-xl font-bold ${netMonthlyBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {netMonthlyBalance >= 0 ? '+' : ''}{netMonthlyBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/20">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Traditional Cost</h3>
                      <p className="text-xl font-bold">${traditionalCost.toFixed(2)}/month</p>
                      <p className="text-xs text-muted-foreground">If you paid for all services individually</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Your Actual Cost</h3>
                      <p className={`text-xl font-bold ${netMonthlyBalance >= 0 ? 'text-green-600' : ''}`}>
                        {netMonthlyBalance >= 0 ? '+' : ''}{netMonthlyBalance.toFixed(2)}/month
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {netMonthlyBalance >= 0 
                          ? "You're earning more than you spend!" 
                          : "Your net cost after sharing"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Annual Savings/Profit</h3>
                      <p className={`text-xl font-bold ${annualSavingsProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {annualSavingsProfit >= 0 ? '+' : ''}{annualSavingsProfit.toFixed(2)}/year
                      </p>
                      <p className="text-xs text-muted-foreground">Compared to individual subscriptions</p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Transactions */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
                  <div className="space-y-2">
                    {transactionsLoading ? (
                      <div className="text-center py-4">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No transactions found
                      </div>
                    ) : (
                      transactions.slice(0, 5).map(transaction => (
                        <div key={transaction.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {transaction.type === 'PAYMENT' ? 'Payment to ' : 'Received from '}
                              {transaction.subscription?.title || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className={`font-medium ${transaction.type === 'PAYMENT' ? 'text-red-500' : 'text-green-600'}`}>
                            {transaction.type === 'PAYMENT' ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}