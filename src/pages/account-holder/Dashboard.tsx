import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, PlusCircle, Users, CreditCard, Calendar, BarChart3, TrendingUp, LineChart } from "lucide-react";

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

export default function AccountHolderDashboard() {
  return (
    <DashboardLayout userRole="unified">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Holder Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your account management dashboard.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
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
          <Card className="lg:col-span-5">
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
                  status="Active"
                  cycle="Monthly"
                />

                <SubscriptionCard
                  title="Disney+ Standard"
                  members="2/4"
                  price="9.80"
                  status="Active"
                  cycle="Monthly"
                />

                <SubscriptionCard
                  title="ChatGPT Plus"
                  members="2/3"
                  price="16.70"
                  status="Active"
                  cycle="Monthly"
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
    </DashboardLayout>
  );
}