import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Receipt, 
  UserRound, 
  Lock, 
  LogOut,
  Calendar
} from "lucide-react";

export default function CoSubscriberSettings() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Account form states
  const [fullName, setFullName] = useState("Sam Smith");
  const [email, setEmail] = useState("sam.smith@example.com");
  
  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  
  // Mock subscriptions data for display purposes
  const subscriptionsData = [
    { 
      id: 1, 
      service: "Netflix Premium", 
      accountHolder: "John Doe",
      monthlyPayment: 13.99,
      nextBillingDate: "May 15, 2025"
    },
    { 
      id: 2, 
      service: "ChatGPT Plus", 
      accountHolder: "Jane Wilson",
      monthlyPayment: 19.99,
      nextBillingDate: "May 3, 2025"
    },
    { 
      id: 3, 
      service: "Disney+ Standard", 
      accountHolder: "Robert Johnson",
      monthlyPayment: 9.99,
      nextBillingDate: "May 21, 2025"
    }
  ];
  
  const totalMonthlyPayments = subscriptionsData.reduce((sum, item) => sum + item.monthlyPayment, 0);
  
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for updating account details
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your account information has been updated.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handlePaymentMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for updating payment method
    setTimeout(() => {
      toast({
        title: "Payment Method Updated",
        description: "Your payment details have been saved.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for updating password
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setIsSubmitting(false);
      
      // Reset password fields
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  return (
    <DashboardLayout userRole="co-subscriber">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and payment methods.
          </p>
        </div>
        
        <Tabs defaultValue="account" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment Methods</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Information Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="kr">South Korea</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Payments</CardTitle>
                <CardDescription>
                  View your current subscription payments and upcoming billing dates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border">
                    <div className="flex items-center p-4 border-b bg-muted/50">
                      <div className="w-1/4 font-medium">Service</div>
                      <div className="w-1/4 font-medium">Account Holder</div>
                      <div className="w-1/4 font-medium">Monthly Payment</div>
                      <div className="w-1/4 font-medium">Next Billing</div>
                    </div>
                    {subscriptionsData.map((item) => (
                      <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
                        <div className="w-1/4">{item.service}</div>
                        <div className="w-1/4">{item.accountHolder}</div>
                        <div className="w-1/4">${item.monthlyPayment.toFixed(2)}</div>
                        <div className="w-1/4 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {item.nextBillingDate}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="rounded-lg border p-4 flex justify-between items-center">
                    <span className="font-medium">Total Monthly Payments</span>
                    <span className="font-bold">${totalMonthlyPayments.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods for subscription charges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentMethodSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethodType">Payment Method</Label>
                      <Select 
                        value={paymentMethod} 
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger id="paymentMethodType">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Credit/Debit Card
                            </div>
                          </SelectItem>
                          <SelectItem value="paypal">
                            <div className="flex items-center">
                              <Wallet className="mr-2 h-4 w-4" />
                              PayPal
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX XXXX"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input 
                              id="cardExpiry"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCVC">CVC</Label>
                            <Input 
                              id="cardCVC"
                              value={cardCVC}
                              onChange={(e) => setCardCVC(e.target.value)}
                              placeholder="CVC"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "paypal" && (
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail">PayPal Email</Label>
                        <Input 
                          id="paypalEmail"
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="Enter your PayPal email"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Payment Method"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Auto-Pay Settings</CardTitle>
                <CardDescription>
                  Configure automatic payment settings for your subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Auto-Pay for Subscriptions</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically charge your default payment method for subscription renewals
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enabled
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-medium">Payment Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email notifications before charges
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View your recent subscription payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="flex items-center p-4 border-b bg-muted/50">
                    <div className="w-2/5 font-medium">Service</div>
                    <div className="w-1/5 font-medium">Amount</div>
                    <div className="w-1/5 font-medium">Date</div>
                    <div className="w-1/5 font-medium">Status</div>
                  </div>
                  <div className="flex items-center p-4 border-b">
                    <div className="w-2/5">Netflix Premium</div>
                    <div className="w-1/5">$13.99</div>
                    <div className="w-1/5">Apr 15, 2025</div>
                    <div className="w-1/5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border-b">
                    <div className="w-2/5">ChatGPT Plus</div>
                    <div className="w-1/5">$19.99</div>
                    <div className="w-1/5">Apr 3, 2025</div>
                    <div className="w-1/5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-4">
                    <div className="w-2/5">Disney+ Standard</div>
                    <div className="w-1/5">$9.99</div>
                    <div className="w-1/5">Mar 21, 2025</div>
                    <div className="w-1/5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions & Security</CardTitle>
                <CardDescription>
                  Manage your active sessions and account security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Protect your account with an additional layer of security
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">Account Sessions</div>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">This Device</div>
                          <div className="text-sm text-muted-foreground">Chrome on MacOS • New York, USA</div>
                        </div>
                        <Button variant="ghost" size="sm">Active</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="text-destructive font-medium">Danger Zone</div>
                  <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-md">
                    <div>
                      <div className="font-medium">Delete Account</div>
                      <div className="text-sm text-muted-foreground">
                        This will permanently delete your account and all data
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
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