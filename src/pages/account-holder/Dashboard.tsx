import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { useToast } from "../../hooks/use-toast";
import { useSubscriptions } from "../../context/SubscriptionProvider";
import { useTransactions } from "../../context/TransactionProvider";
import { useMembers } from "../../context/MemberProvider";
import { useProfile } from "../../context/ProfileProvider";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CreditCard,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  User,
  Bell,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
  Receipt,
} from "lucide-react";

// Subscription Card Component
interface SubscriptionCardProps {
  title: string;
  members: string;
  price: string;
  status: "Active" | "Pending" | "Expired";
  cycle: "Monthly" | "Yearly";
  isJoined?: boolean;
}

function SubscriptionCard({ title, members, price, status, cycle, isJoined }: SubscriptionCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <p className="font-medium">{title}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-3.5 w-3.5" />
          <span>{members} members</span>
          {cycle && <span className="ml-2">· {cycle}</span>}
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${price}/mo</p>
        <Badge 
          variant="outline" 
          className={
            status === "Active" 
              ? "bg-green-50 text-green-700" 
              : status === "Pending" 
                ? "bg-yellow-50 text-yellow-700" 
                : "bg-red-50 text-red-700"
          }
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { toast } = useToast();
  const { profile, fetchProfile } = useProfile();
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchProfile(),
          fetchSubscriptions(),
          fetchTransactions()
        ]);
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

  // Calculate dashboard metrics
  const totalSpending = transactions
    .filter(t => t.type === 'PAYMENT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalEarnings = transactions
    .filter(t => t.type === 'PAYOUT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const activeSubscriptions = ownedSubscriptions.filter(s => s.status === 'ACTIVE').length;
  const pendingPayments = transactions.filter(t => t.status === 'PENDING').length;

  // Replace static chart data with dynamic data from transactions
  const getMonthlySpendingData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map(month => ({ name: month, amount: 0 }));
    
    transactions.forEach(transaction => {
      if (transaction.type === 'PAYMENT') {
        const date = new Date(transaction.createdAt);
        if (date.getFullYear() === currentYear) {
          monthlyData[date.getMonth()].amount += transaction.amount;
        }
      }
    });
    
    return monthlyData;
  };

  const getSubscriptionDistribution = () => {
    const categories = {};
    
    subscriptions.forEach(sub => {
      const category = sub.service?.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Use these functions to get dynamic data
  const monthlySpending = getMonthlySpendingData();
  const subscriptionDistribution = getSubscriptionDistribution();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout userRole="unified">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoading(true);
                Promise.all([fetchProfile(), fetchSubscriptions(), fetchTransactions()])
                  .finally(() => setIsLoading(false));
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
              <Link to="/account/create-subscription">
                <Plus className="mr-2 h-4 w-4" /> Create Subscription
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpending.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    {ownedSubscriptions.length} owned, {memberSubscriptions.length} joined
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    Due in the next 7 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySpending}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subscriptionDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {subscriptionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent transactions and subscription changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center">
                      <div className="mr-4 rounded-full p-2 bg-primary/10">
                        {transaction.type === 'PAYMENT' ? (
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.type === 'PAYMENT' ? 'Payment to ' : 'Received from '}
                          {transaction.subscription?.title || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), 'PPP')}
                        </p>
                      </div>
                      <div className={`font-medium ${transaction.type === 'PAYMENT' ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.type === 'PAYMENT' ? '-' : '+'}${transaction.amount}
                      </div>
                    </div>
                  ))}
                  
                  {transactions.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent transactions
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Subscriptions</h2>
              <Button asChild>
                <Link to="/account/create-subscription">
                  <Plus className="mr-2 h-4 w-4" /> Create New
                </Link>
              </Button>
            </div>
            
            {subscriptionsLoading ? (
              <div className="text-center py-8">Loading subscriptions...</div>
            ) : ownedSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Subscriptions Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    You haven't created any subscriptions yet. Create a subscription to start sharing with others.
                  </p>
                  <Button asChild>
                    <Link to="/account/create-subscription">Create Subscription</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ownedSubscriptions.map(subscription => (
                  <Card key={subscription.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {subscription.service?.logo ? (
                            <img 
                              src={subscription.service.logo} 
                              alt={subscription.service.name} 
                              className="h-8 w-8 mr-2 rounded"
                            />
                          ) : (
                            <div className="h-8 w-8 mr-2 rounded bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <CardTitle>{subscription.title}</CardTitle>
                        </div>
                        <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {subscription.service?.name || 'Custom Subscription'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price:</span>
                          <span className="font-medium">${subscription.price} / {subscription.cycle.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Members:</span>
                          <span className="font-medium">{subscription.members.length} / {subscription.maxMembers}</span>
                        </div>
                        <div className="mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Capacity</span>
                            <span>{Math.round((subscription.members.length / subscription.maxMembers) * 100)}%</span>
                          </div>
                          <Progress value={(subscription.members.length / subscription.maxMembers) * 100} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Next Payment:</span>
                          <span className="font-medium">
                            {subscription.nextPaymentDate 
                              ? format(new Date(subscription.nextPaymentDate), 'MMM d, yyyy')
                              : 'Not scheduled'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscriptions I've Joined</h2>
            </div>
            
            {subscriptionsLoading ? (
              <div className="text-center py-8">Loading memberships...</div>
            ) : memberSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Memberships Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    You haven't joined any subscriptions yet. Browse available subscriptions to join.
                  </p>
                  <Button asChild>
                    <Link to="/browse">Browse Subscriptions</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {memberSubscriptions.map(subscription => (
                  <Card key={subscription.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {subscription.service?.logo ? (
                            <img 
                              src={subscription.service.logo} 
                              alt={subscription.service.name} 
                              className="h-8 w-8 mr-2 rounded"
                            />
                          ) : (
                            <div className="h-8 w-8 mr-2 rounded bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <CardTitle>{subscription.title}</CardTitle>
                        </div>
                        <Badge variant="outline">Member</Badge>
                      </div>
                      <CardDescription>
                        {subscription.service?.name || 'Custom Subscription'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Your Cost:</span>
                          <span className="font-medium">${(subscription.price / subscription.maxMembers).toFixed(2)} / {subscription.cycle.toLowerCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Owner:</span>
                          <span className="font-medium">
                            {subscription.members.find(m => m.role === 'ADMIN')?.user.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Next Payment:</span>
                          <span className="font-medium">
                            {subscription.nextPaymentDate 
                              ? format(new Date(subscription.nextPaymentDate), 'MMM d, yyyy')
                              : 'Not scheduled'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all your payments and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      {activeTab === "overview" 
                        ? "You don't have any recent transactions."
                        : "You haven't made any payments or received any earnings yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map(transaction => (
                      <div key={transaction.id} className="flex items-center p-3 border rounded-lg">
                        <div className={`mr-4 rounded-full p-2 ${
                          transaction.type === 'PAYMENT' 
                            ? 'bg-red-100' 
                            : transaction.type === 'REFUND' 
                              ? 'bg-amber-100' 
                              : 'bg-green-100'
                        }`}>
                          {transaction.type === 'PAYMENT' ? (
                            <ArrowUpRight className={`h-4 w-4 ${
                              transaction.type === 'PAYMENT' 
                                ? 'text-red-500' 
                                : transaction.type === 'REFUND' 
                                  ? 'text-amber-500' 
                                  : 'text-green-500'
                            }`} />
                          ) : transaction.type === 'REFUND' ? (
                            <ArrowDownRight className="h-4 w-4 text-amber-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {transaction.type === 'PAYMENT' 
                              ? 'Payment to ' 
                              : transaction.type === 'REFUND' 
                                ? 'Refund from ' 
                                : 'Payout from '
                            }
                            {transaction.subscription?.title || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.createdAt), 'PPP')} • 
                            <Badge variant="outline" className="ml-2">
                              {transaction.status}
                            </Badge>
                          </p>
                        </div>
                        <div className={`font-medium ${
                          transaction.type === 'PAYMENT' 
                            ? 'text-red-500' 
                            : transaction.type === 'REFUND' 
                              ? 'text-amber-500' 
                              : 'text-green-500'
                        }`}>
                          {transaction.type === 'PAYMENT' ? '-' : '+'}${transaction.amount}
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memberships Tab */}
          <TabsContent value="memberships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Memberships</CardTitle>
                <CardDescription>Subscriptions you've joined</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptionsLoading ? (
                  <div className="text-center py-8">Loading memberships...</div>
                ) : memberSubscriptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Memberships Yet</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      You haven't joined any subscriptions yet. Browse available subscriptions to join.
                    </p>
                    <Button asChild>
                      <Link to="/browse">Browse Subscriptions</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {memberSubscriptions.map(subscription => (
                      <div key={subscription.id} className="flex items-center p-4 border rounded-lg">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={subscription.service?.logo} alt={subscription.service?.name} />
                          <AvatarFallback>{subscription.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{subscription.title}</h3>
                            <Badge className="ml-2" variant="outline">
                              {subscription.cycle}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ${(subscription.price / subscription.maxMembers).toFixed(2)} per {subscription.cycle.toLowerCase()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}