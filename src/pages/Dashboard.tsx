import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, PlusCircle, User, Users, CreditCard, Calendar, BarChart3, TrendingUp, LineChart } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"unified" | "admin">("unified");

  const changeRole = (role: "account-holder" | "co-subscriber" | "admin") => {
    setUserRole(role === "admin" ? "admin" : "unified");
  };

  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Development Mode: Change Role</CardTitle>
            <CardDescription>Switch user roles to see different dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                variant={userRole === "unified" ? "default" : "outline"} 
                onClick={() => changeRole("account-holder")}
              >
                Account Holder
              </Button>
              <Button 
                variant={userRole === "unified" ? "default" : "outline"} 
                onClick={() => changeRole("co-subscriber")}
              >
                Co-Subscriber
              </Button>
              <Button 
                variant={userRole === "admin" ? "default" : "outline"}
                onClick={() => changeRole("admin")}
              >
                Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {userRole === "unified" && <AccountHolderDashboard />}
        {userRole === "unified" && <CoSubscriberDashboard />}
        {userRole === "admin" && <AdminDashboard />}
      </div>
    </DashboardLayout>
  );
}

function AccountHolderDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Holder Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your account management dashboard.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$93.50</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 inline" />
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              13 total subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">
              from 32 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NavLink to="/account-holder/create-subscription">
              <Button className="w-full justify-start" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Subscription
              </Button>
            </NavLink>

            <NavLink to="/account-holder/manage-members">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Members
              </Button>
            </NavLink>

            <NavLink to="/account-holder/payments">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Payments & Settlements
              </Button>
            </NavLink>
          </CardContent>
        </Card>

        {/* My Subscriptions */}
        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Subscription Services</CardTitle>
              <CardDescription>
                Current status of your shared subscriptions
              </CardDescription>
            </div>
            <NavLink to="/account-holder/create-subscription">
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
            </NavLink>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SubscriptionCard
                title="Netflix Premium"
                members="4/4"
                price="13.75"
                status="활성"
                cycle="월간"
              />

              <SubscriptionCard
                title="Disney+ Standard"
                members="2/4"
                price="9.80"
                status="활성"
                cycle="월간"
              />

              <SubscriptionCard
                title="ChatGPT Plus"
                members="2/3"
                price="16.70"
                status="활성"
                cycle="월간"
              />

              <div className="text-center mt-6">
                <NavLink to="/account-holder/create-subscription">
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Subscription
                  </Button>
                </NavLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>
            Your payment schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Netflix Premium</p>
                  <p className="text-sm text-muted-foreground">4 subscribers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$55.00</p>
                <p className="text-sm text-muted-foreground">2025-04-15</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Disney+ Standard</p>
                  <p className="text-sm text-muted-foreground">2 subscribers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$19.60</p>
                <p className="text-sm text-muted-foreground">2025-04-10</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">ChatGPT Plus</p>
                  <p className="text-sm text-muted-foreground">2 subscribers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$33.40</p>
                <p className="text-sm text-muted-foreground">2025-04-05</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CoSubscriberDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriber Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your subscriptions and find new ones to join.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Using 3 services in total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10.95</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-68%</span> compared to individual plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$281.40</div>
            <p className="text-xs text-muted-foreground">
              Saved compared to individual purchases
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NavLink to="/co-subscriber/find-subscriptions">
              <Button className="w-full justify-start" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Find Subscriptions
              </Button>
            </NavLink>

            <NavLink to="/co-subscriber/my-subscriptions">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage My Subscriptions
              </Button>
            </NavLink>

            <NavLink to="/profile">
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
            </NavLink>
          </CardContent>
        </Card>

        {/* My Subscriptions */}
        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Subscriptions</CardTitle>
              <CardDescription>
                Status of your current subscriptions
              </CardDescription>
            </div>
            <NavLink to="/co-subscriber/find-subscriptions">
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Find More
              </Button>
            </NavLink>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Netflix Premium</p>
                  <p className="text-sm text-muted-foreground">Profile 2</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$4.25/mo</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Notion Team</p>
                  <p className="text-sm text-muted-foreground">Email Invite</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$3.80/mo</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Spotify Family</p>
                  <p className="text-sm text-muted-foreground">Member 3</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2.90/mo</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">ChatGPT Plus</p>
                  <p className="text-sm text-muted-foreground">Personal Account</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$6.70/mo</p>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                </div>
              </div>

              <div className="mt-4">
                <NavLink to="/co-subscriber/my-subscriptions">
                  <Button variant="outline" className="w-full">
                    Manage All Subscriptions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </NavLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Subscriptions</CardTitle>
          <CardDescription>
            Most popular subscription plans right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium">Netflix Premium</h3>
              <p className="text-sm text-muted-foreground">From $4.25/month</p>
              <div className="flex items-center mt-2 text-sm">
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>Available seats: 2/4</span>
              </div>
              <Button size="sm" className="w-full mt-3">Join Now</Button>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium">YouTube Premium Family</h3>
              <p className="text-sm text-muted-foreground">From $3.80/month</p>
              <div className="flex items-center mt-2 text-sm">
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>Available seats: 3/5</span>
              </div>
              <Button size="sm" className="w-full mt-3">Join Now</Button>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="font-medium">Microsoft 365 Family</h3>
              <p className="text-sm text-muted-foreground">From $2.90/month</p>
              <div className="flex items-center mt-2 text-sm">
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>Available seats: 4/6</span>
              </div>
              <Button size="sm" className="w-full mt-3">Join Now</Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <NavLink to="/co-subscriber/find-subscriptions">
              <Button>
                Find More Subscriptions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and user management
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2">
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
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

interface SubscriptionCardProps {
  title: string;
  members: string;
  price: string;
  status: "활성" | "대기중" | "만료됨";
  cycle: "월간" | "연간";
  isJoined?: boolean;
}

function SubscriptionCard({ title, members, price, status, cycle, isJoined }: SubscriptionCardProps) {
  // Convert status to English
  const statusInEnglish = 
    status === "활성" ? "Active" : 
    status === "대기중" ? "Pending" : 
    "Expired";
  
  // Convert cycle to English
  const cycleInEnglish = cycle === "월간" ? "Monthly" : "Yearly";
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <p className="font-medium">{title}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-3.5 w-3.5" />
          <span>{members} members</span>
          {cycle && <span className="ml-2">· {cycleInEnglish}</span>}
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${price}/mo</p>
        <Badge 
          variant="outline" 
          className={
            status === "활성" 
              ? "bg-green-50 text-green-700" 
              : status === "대기중" 
                ? "bg-yellow-50 text-yellow-700" 
                : "bg-red-50 text-red-700"
          }
        >
          {statusInEnglish}
        </Badge>
      </div>
    </div>
  );
}