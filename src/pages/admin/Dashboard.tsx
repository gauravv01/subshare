import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Users, 
  User, 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import axiosInstance from "../../lib/axiosInstance";
import { format } from "date-fns";

// Define types for our dashboard data
interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalTransactions: number;
  platformFees: number;
  userGrowth: number;
  subscriptionGrowth: number;
  transactionGrowth: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PopularService {
  id: string;
  name: string;
  planType: string;
  subscriptionCount: number;
  participantCount: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalTransactions: 0,
    platformFees: 0,
    userGrowth: 0,
    subscriptionGrowth: 0,
    transactionGrowth: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [serviceCount, setServiceCount] = useState({ services: 0, plans: 0 });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await axiosInstance.get('/admin/dashboard/stats');
        setStats({
          totalUsers: statsResponse.data.totalUsers,
          activeSubscriptions: statsResponse.data.activeSubscriptions,
          totalTransactions: statsResponse.data.totalTransactions,
          platformFees: statsResponse.data.platformFees._sum.amount || 0,
          userGrowth: statsResponse.data.userGrowth._count,
          subscriptionGrowth: statsResponse.data.subscriptionGrowth._count,
          transactionGrowth: statsResponse.data.transactionGrowth._count
        });
        
        // Fetch recent users
        const usersResponse = await axiosInstance.get('/admin/dashboard/recent-users');
        setRecentUsers(usersResponse.data);
        
        // Fetch popular services
        const servicesResponse = await axiosInstance.get('/admin/dashboard/popular-services');
        setPopularServices(servicesResponse.data);
        
        // Fetch service counts
        const serviceCountResponse = await axiosInstance.get('/admin/dashboard/service-counts');
        setServiceCount(serviceCountResponse.data);
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
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
      <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and user management
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stats.userGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.userGrowth >= 0 ? "+" : ""}{stats.userGrowth}%
                </span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stats.subscriptionGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.subscriptionGrowth >= 0 ? "+" : ""}{stats.subscriptionGrowth}%
                </span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.totalTransactions / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                <span className={stats.transactionGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.transactionGrowth >= 0 ? "+" : ""}{stats.transactionGrowth}%
                </span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(stats.platformFees / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">
                Total revenue for {format(new Date(), 'MMMM')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NavLink to="/admin/services">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Services</CardTitle>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Configure subscription services and plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {serviceCount.services} active services, {serviceCount.plans} subscription plans
                  </p>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </NavLink>

          <NavLink to="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {stats.totalUsers.toLocaleString()} users, 3 user roles
                  </p>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </NavLink>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Recently registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent users found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{user.name || 'Unnamed User'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge>{user.role === 'ADMIN' ? 'Admin' : user.role === 'UNIFIED' ? 'User' : user.role}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(user.createdAt), 'yyyy-MM-dd')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <NavLink to="/admin/users">
                  <Button variant="outline" className="cursor-pointer text-black" size="sm">View All Users</Button>
                </NavLink>
              </div>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>
                Most frequently shared subscription services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {popularServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No services data available
                </div>
              ) : (
                <div className="space-y-4">
                  {popularServices.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.planType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{service.subscriptionCount} subscriptions</p>
                        <p className="text-sm text-muted-foreground">{service.participantCount} participants</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <NavLink to="/admin/services">
                  <Button variant="outline" className="cursor-pointer text-black" size="sm">Manage Services</Button>
                </NavLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}