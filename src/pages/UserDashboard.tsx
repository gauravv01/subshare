import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link, NavLink } from "react-router-dom";
import { 
  ArrowRight, 
  PlusCircle, 
  User, 
  Users, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  BookOpen, 
  Coins, 
  GanttChart,
  Share2,
  Clock,
  DollarSign
} from "lucide-react";

export default function UserDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your subscription sharing and subscriptions you've joined.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <GanttChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="my-shares" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>My Shares</span>
            </TabsTrigger>
            <TabsTrigger value="my-subscriptions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>My Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span>Finances</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$82.55</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 inline" />
                    <span className="text-green-600">+8.2%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Services Offering</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
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
                  <CardTitle className="text-sm font-medium">Services Joined</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+1</span> new this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$243.60</div>
                  <p className="text-xs text-muted-foreground">
                    annually vs individual plans
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Services I'm Offering */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services I'm Offering</CardTitle>
                    <CardDescription>
                      Subscriptions you're sharing with others
                    </CardDescription>
                  </div>
                  <NavLink to="/create-subscription">
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </NavLink>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Netflix Premium</p>
                        <p className="text-sm text-muted-foreground">4/4 seats filled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$13.75/mo per member</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Disney+ Standard</p>
                        <p className="text-sm text-muted-foreground">2/4 seats filled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$9.80/mo per member</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">ChatGPT Plus</p>
                        <p className="text-sm text-muted-foreground">2/3 seats filled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$16.70/mo per member</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                    </div>

                    <div className="text-center mt-2">
                      <NavLink to="/create-subscription">
                        <Button variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Share More Services
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services I've Joined */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Services I've Joined</CardTitle>
                    <CardDescription>
                      Subscriptions you're a member of
                    </CardDescription>
                  </div>
                  <NavLink to="/find-subscriptions">
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
                        <p className="font-medium">Spotify Family</p>
                        <p className="text-sm text-muted-foreground">Profile: Member 3</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$2.90/mo</p>
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
                        <p className="font-medium">YouTube Premium</p>
                        <p className="text-sm text-muted-foreground">Email account</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$3.25/mo</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Microsoft 365</p>
                        <p className="text-sm text-muted-foreground">User account</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$1.00/mo</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Payments & Billing */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments & Billing</CardTitle>
                <CardDescription>
                  Your upcoming payment schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium">Netflix Premium</p>
                        <p className="text-sm text-muted-foreground">Owner: You (4 subscribers)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">-$55.00</p>
                      <p className="text-sm text-muted-foreground">2025-04-15</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium">Netflix Premium (Subscriber Revenue)</p>
                        <p className="text-sm text-muted-foreground">From 4 subscribers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">+$55.00</p>
                      <p className="text-sm text-muted-foreground">2025-04-10</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium">Spotify Family</p>
                        <p className="text-sm text-muted-foreground">Subscription Fee</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">-$2.90</p>
                      <p className="text-sm text-muted-foreground">2025-04-05</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Shares Tab */}
          <TabsContent value="my-shares" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">My Shared Subscriptions</h2>
                <p className="text-muted-foreground">Manage services you're sharing with others</p>
              </div>
              <NavLink to="/create-subscription">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Share New Service
                </Button>
              </NavLink>
            </div>

            <div className="grid gap-6">
              {/* Netflix Premium */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Netflix Premium</CardTitle>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <CardDescription>4K UHD streaming service with 4 screens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Cost</h3>
                      <p className="text-lg font-bold">$55.00/month</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Members</h3>
                      <p className="text-lg font-bold">4/4 seats filled</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Per-Member Price</h3>
                      <p className="text-lg font-bold">$13.75/month</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Members</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Sarah Kim</p>
                            <p className="text-xs text-muted-foreground">Member since Feb 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Profile 1</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Mark Johnson</p>
                            <p className="text-xs text-muted-foreground">Member since Mar 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Profile 2</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Lisa Wong</p>
                            <p className="text-xs text-muted-foreground">Member since Jan 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Profile 3</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Edit Settings</Button>
                    <Button>Manage Members</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Disney+ */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Disney+ Standard</CardTitle>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <CardDescription>HD streaming with 4 screens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Cost</h3>
                      <p className="text-lg font-bold">$39.20/month</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Members</h3>
                      <p className="text-lg font-bold">2/4 seats filled</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Per-Member Price</h3>
                      <p className="text-lg font-bold">$9.80/month</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Members</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Alex Chen</p>
                            <p className="text-xs text-muted-foreground">Member since Mar 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Profile 1</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Jessica Taylor</p>
                            <p className="text-xs text-muted-foreground">Member since Feb 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Profile 2</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Available seat</p>
                        </div>
                        <Button size="sm" variant="outline">Find Member</Button>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Available seat</p>
                        </div>
                        <Button size="sm" variant="outline">Find Member</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Edit Settings</Button>
                    <Button>Manage Members</Button>
                  </div>
                </CardContent>
              </Card>

              {/* ChatGPT Plus */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>ChatGPT Plus</CardTitle>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <CardDescription>AI assistant with premium features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscription Cost</h3>
                      <p className="text-lg font-bold">$50.10/month</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Members</h3>
                      <p className="text-lg font-bold">2/3 seats filled</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Per-Member Price</h3>
                      <p className="text-lg font-bold">$16.70/month</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Members</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">David Park</p>
                            <p className="text-xs text-muted-foreground">Member since Jan 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Email Access</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Michael Brown</p>
                            <p className="text-xs text-muted-foreground">Member since Mar 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Email Access</Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded-md flex justify-between items-center bg-muted/20">
                        <div className="flex items-center gap-2">
                          <PlusCircle className="h-4 w-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Available seat</p>
                        </div>
                        <Button size="sm" variant="outline">Find Member</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Edit Settings</Button>
                    <Button>Manage Members</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Subscriptions Tab */}
          <TabsContent value="my-subscriptions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">My Subscriptions</h2>
                <p className="text-muted-foreground">Services you've joined as a member</p>
              </div>
              <NavLink to="/find-subscriptions">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Find More Services
                </Button>
              </NavLink>
            </div>

            <div className="grid gap-6">
              {/* Spotify Family */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Spotify Family</CardTitle>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <CardDescription>Premium music streaming service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Cost</h3>
                      <p className="text-lg font-bold">$2.90/month</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Holder</h3>
                      <p className="text-lg font-bold">Jason Miller</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Payment</h3>
                      <p className="text-lg font-bold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Apr 22, 2025
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Access Method</h3>
                      <p className="text-lg font-bold">Member 3</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Account Information</h3>
                    <div className="p-4 border rounded-md space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Login Email:</p>
                          <p className="font-medium">spotify.family.member3@example.com</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Password:</p>
                          <p className="font-medium">••••••••••</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Usage Notes:</p>
                        <p>Please don't change the account password or profile information. Contact the account holder for any issues with access.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Leave Subscription</Button>
                    <Button>Message Account Holder</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notion Team */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notion Team</CardTitle>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <CardDescription>Team workspace and project management tool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Cost</h3>
                      <p className="text-lg font-bold">$3.80/month</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Holder</h3>
                      <p className="text-lg font-bold">Rachel Lee</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Payment</h3>
                      <p className="text-lg font-bold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Apr 15, 2025
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Access Method</h3>
                      <p className="text-lg font-bold">Email Invite</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Account Information</h3>
                    <div className="p-4 border rounded-md space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Access Via:</p>
                          <p className="font-medium">Email invite to your account</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Workspace:</p>
                          <p className="font-medium">Creative Team Workspace</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Usage Notes:</p>
                        <p>You have member-level access to the workspace. Please respect workspace rules and file organization.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">Leave Subscription</Button>
                    <Button>Message Account Holder</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Other subscriptions would follow the same pattern */}
            </div>
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Financial Overview</h2>
                <p className="text-muted-foreground">Track your earnings and expenses</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                  <CardDescription>Revenue from subscriptions you share</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Netflix Premium</span>
                        <span className="font-medium">$55.00/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disney+ Standard</span>
                        <span className="font-medium">$19.60/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ChatGPT Plus</span>
                        <span className="font-medium">$33.40/month</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold">$108.00/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Platform Fee (5%)</span>
                        <span className="text-sm text-muted-foreground">-$5.40/month</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Net Revenue</span>
                        <span className="font-bold text-green-600">$102.60/month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View History</Button>
                    <Button>Withdraw Funds</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses Summary</CardTitle>
                  <CardDescription>What you pay for subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Netflix Premium</span>
                        <span className="font-medium">-$55.00/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spotify Family</span>
                        <span className="font-medium">-$2.90/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notion Team</span>
                        <span className="font-medium">-$3.80/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">YouTube Premium</span>
                        <span className="font-medium">-$3.25/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Microsoft 365</span>
                        <span className="font-medium">-$1.00/month</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Total Expenses</span>
                        <span className="font-bold text-red-500">-$65.95/month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View History</Button>
                    <Button>Update Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Balance</CardTitle>
                <CardDescription>Your overall subscription sharing balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Revenue</h3>
                      <p className="text-xl font-bold text-green-600">+$102.60</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Expenses</h3>
                      <p className="text-xl font-bold text-red-500">-$65.95</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Net Monthly Balance</h3>
                      <p className="text-xl font-bold text-green-600">+$36.65</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/20">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Traditional Cost</h3>
                      <p className="text-xl font-bold">$118.95/month</p>
                      <p className="text-xs text-muted-foreground">If you paid for all services individually</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Your Actual Cost</h3>
                      <p className="text-xl font-bold">-$36.65/month</p>
                      <p className="text-xs text-muted-foreground">You're earning more than you spend!</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Annual Savings/Profit</h3>
                      <p className="text-xl font-bold text-green-600">+$1,867.20/year</p>
                      <p className="text-xs text-muted-foreground">Compared to individual subscriptions</p>
                    </div>
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