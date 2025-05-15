import React from "react";
import {  NavLink } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { PlusCircle, Users, User, CreditCard, BarChart3, TrendingUp } from "lucide-react";

export default function CoSubscriberDashboard() {
  return (
    <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriber Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your subscriptions and find new ones to join.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              <NavLink to="/connect">
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
          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>My Subscriptions</CardTitle>
                <CardDescription>
                  Status of your current subscriptions
                </CardDescription>
              </div>
              <NavLink to="/connect">
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
                    <p className="font-medium">Disney+ Bundle</p>
                    <p className="text-sm text-muted-foreground">Profile 1</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$3.25/mo</p>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <NavLink to="/connect">
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Find More Subscriptions
                    </Button>
                  </NavLink>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Subscriptions</CardTitle>
            <CardDescription>
              Subscriptions that might interest you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">HBO Max Premium</p>
                  <p className="text-sm text-muted-foreground">2 seats available</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$4.99/mo</p>
                  <NavLink to="/listing/listing6">
                    <Button size="sm" variant="outline">View Details</Button>
                  </NavLink>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">YouTube Premium</p>
                  <p className="text-sm text-muted-foreground">3 seats available</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$3.99/mo</p>
                  <NavLink to="/listing/listing8">
                    <Button size="sm" variant="outline">View Details</Button>
                  </NavLink>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Microsoft 365</p>
                  <p className="text-sm text-muted-foreground">3 seats available</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2.50/mo</p>
                  <NavLink to="/listing/listing4">
                    <Button size="sm" variant="outline">View Details</Button>
                  </NavLink>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}