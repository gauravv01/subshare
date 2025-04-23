import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Users, User, CreditCard, BarChart3, TrendingUp, Settings, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardLayout userRole="admin">
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
              <div className="text-2xl font-bold">1,285</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">542</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$32.5M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3.25M</div>
              <p className="text-xs text-muted-foreground">
                Total revenue for March
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
                  <p className="text-sm text-muted-foreground">8 active services, 24 subscription plans</p>
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
                  <p className="text-sm text-muted-foreground">1,285 users, 3 user roles</p>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jamie Kim</p>
                      <p className="text-sm text-muted-foreground">jimin@example.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>Account Holder</Badge>
                    <p className="text-sm text-muted-foreground">2025-03-17</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Sean Lee</p>
                      <p className="text-sm text-muted-foreground">seungho@example.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>Co-Subscriber</Badge>
                    <p className="text-sm text-muted-foreground">2025-03-16</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Jay Choi</p>
                      <p className="text-sm text-muted-foreground">jaewon@example.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>Co-Subscriber</Badge>
                    <p className="text-sm text-muted-foreground">2025-03-15</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Mina Park</p>
                      <p className="text-sm text-muted-foreground">mina@example.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge>Account Holder</Badge>
                    <p className="text-sm text-muted-foreground">2025-03-14</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <NavLink to="/admin/users">
                  <Button variant="outline" size="sm">View All Users</Button>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Netflix</p>
                    <p className="text-sm text-muted-foreground">Premium account</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">152 subscriptions</p>
                    <p className="text-sm text-muted-foreground">584 participants</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Disney+</p>
                    <p className="text-sm text-muted-foreground">Standard account</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">98 subscriptions</p>
                    <p className="text-sm text-muted-foreground">312 participants</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Spotify</p>
                    <p className="text-sm text-muted-foreground">Family account</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">87 subscriptions</p>
                    <p className="text-sm text-muted-foreground">423 participants</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">YouTube Premium</p>
                    <p className="text-sm text-muted-foreground">Family account</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">76 subscriptions</p>
                    <p className="text-sm text-muted-foreground">294 participants</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <NavLink to="/admin/services">
                  <Button variant="outline" size="sm">Manage Services</Button>
                </NavLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}