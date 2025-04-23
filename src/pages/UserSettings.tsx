import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
  import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  PieChart, 
  UserRound, 
  FileText, 
  Lock, 
  LogOut,
  Calendar,
  BellRing,
  ShieldCheck,
  DollarSign,
  Receipt,
  Globe,
  Mail,
  Phone
} from "lucide-react";
import { useProfile } from "../context/ProfileProvider";
import { useBank } from "../context/BankProvider";

export default function UserSettings() {
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();
  const { bankDetails, fetchBankDetails , updateBankDetails, fetchWithdrawalMethods, updateWithdrawalMethod, createWithdrawalMethod, withdrawalMethods } = useBank();
  const [currentTab, setCurrentTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form states
  const [fullName, setFullName] = useState(profile?.name || "Gaurav");
  const [email, setEmail] = useState(profile?.email || "vermagaurav171995@gmail.com");
  const [phone, setPhone] = useState(profile?.phoneNumber || "+1234567890");
  
  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState(bankDetails?.type || "");
  const [cardNumber, setCardNumber] = useState(bankDetails?.cardNumber || "");
  const [cardExpiry, setCardExpiry] = useState(bankDetails?.cardExpirationDate || "");
  const [cardCVC, setCardCVC] = useState(bankDetails?.cardCvv || "");
  const [paypalEmail, setPaypalEmail] = useState(bankDetails?.provider || "");
  
  // Withdrawal method states
  const [withdrawalMethod, setWithdrawalMethod] = useState(withdrawalMethods?.type || "");
  const [bankName, setBankName] = useState(withdrawalMethods?.provider || "");
  const [accountNumber, setAccountNumber] = useState(withdrawalMethods?.accountNumber || "");
  const [routingNumber, setRoutingNumber] = useState(withdrawalMethods?.routingNumber || "");
  const [paypalWithdrawalEmail, setPaypalWithdrawalEmail] = useState(withdrawalMethods?.provider || "");
  const [country, setCountry] = useState(profile?.country || "India");
  const [language, setLanguage] = useState(profile?.language || "English");
  const [timezone, setTimezone] = useState(profile?.timezone || "Asia/Kolkata");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(profile?.emailNotifications ||   true);
  const [paymentReminders, setPaymentReminders] = useState(profile?.paymentReminders || true);
  const [newMemberAlerts, setNewMemberAlerts] = useState(profile?.newMemberAlerts || true);
  const [marketingEmails, setMarketingEmails] = useState(profile?.marketingEmails || false);

  useEffect(() => {
    fetchBankDetails();
    fetchWithdrawalMethods();
  }, []);
  
  // Handle profile form submission
  const handleProfileSubmit = async   (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const updatedProfile = {
      ...profile,
      name: fullName,
      email: email,
      phoneNumber: phone,
      country: country,
      language: language,
      timezone: timezone
    };
    
    await updateProfile(updatedProfile);

    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle payment method form submission
  const handlePaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedBankDetails = {
      ...bankDetails,
      cardNumber,
      cardExpirationDate: cardExpiry,
      cardCvv: cardCVC,
      provider: paypalEmail
    };
    
    await updateBankDetails(updatedBankDetails);


    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been saved.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle withdrawal method form submission
  const handleWithdrawalMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal Method Updated",
        description: "Your withdrawal method has been saved.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle notification preferences form submission
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification Preferences Updated",
        description: "Your notification settings have been saved.",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, payment methods, and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="profile" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="withdrawal" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Withdrawals</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Finances</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
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
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us" value={country} onValueChange={(value) => setCountry(value)}>
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
                      <p className="text-xs text-muted-foreground mt-1">
                        You'll only be able to share accounts with users from the same country.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select defaultValue="en" value={language} onValueChange={(value) => setLanguage(value)}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ko">한국어</SelectItem>
                          <SelectItem value="jp">日本語</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="pst" value={timezone} onValueChange={(value) => setTimezone(value)}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select a timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">Pacific Standard Time (UTC-8)</SelectItem>
                          <SelectItem value="est">Eastern Standard Time (UTC-5)</SelectItem>
                          <SelectItem value="gmt">Greenwich Mean Time (UTC+0)</SelectItem>
                          <SelectItem value="cet">Central European Time (UTC+1)</SelectItem>
                          <SelectItem value="kst">Korea Standard Time (UTC+9)</SelectItem>
                          <SelectItem value="jst">Japan Standard Time (UTC+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="  hover:bg-primary/90" variant={"outline"} >
                    {isSubmitting ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Preferences</CardTitle>
                <CardDescription>
                  Choose how other users can contact you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Contact</p>
                        <p className="text-sm text-muted-foreground">Allow other users to contact you via email</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone Contact</p>
                        <p className="text-sm text-muted-foreground">Allow other users to contact you via phone</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                
                <Button className="mt-4">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage how you pay for subscription services you join.
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
                  Configure automatic payment settings for your joined subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Pay for Subscriptions</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically charge your default payment method for subscription renewals
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications before charges
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Payment Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Receive monthly email summary of all subscription expenses
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <Button className="mt-4">Save Settings</Button>
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
                    <div className="w-2/5">Spotify Family</div>
                    <div className="w-1/5">$2.90</div>
                    <div className="w-1/5">Apr 5, 2025</div>
                    <div className="w-1/5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-4">
                    <div className="w-2/5">Microsoft 365</div>
                    <div className="w-1/5">$1.00</div>
                    <div className="w-1/5">Mar 28, 2025</div>
                    <div className="w-1/5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-4">View All Transactions</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Withdrawal Methods Tab */}
          <TabsContent value="withdrawal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Methods</CardTitle>
                <CardDescription>
                  Manage how you receive payments from your subscription earnings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdrawalMethodSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawalMethodType">Withdrawal Method</Label>
                      <Select 
                        value={withdrawalMethod} 
                        onValueChange={setWithdrawalMethod}
                      >
                        <SelectTrigger id="withdrawalMethodType">
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">
                            <div className="flex items-center">
                              <Building2 className="mr-2 h-4 w-4" />
                              Bank Account
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
                    
                    {withdrawalMethod === "bank" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input 
                            id="bankName"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Enter bank name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input 
                            id="accountNumber"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input 
                            id="routingNumber"
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                            placeholder="Enter routing number"
                          />
                        </div>
                      </div>
                    )}
                    
                    {withdrawalMethod === "paypal" && (
                      <div className="space-y-2">
                        <Label htmlFor="paypalWithdrawalEmail">PayPal Email</Label>
                        <Input 
                          id="paypalWithdrawalEmail"
                          type="email"
                          value={paypalWithdrawalEmail}
                          onChange={(e) => setPaypalWithdrawalEmail(e.target.value)}
                          placeholder="Enter your PayPal email"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Withdrawal Method"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive your earnings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawalFrequency">Withdrawal Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="withdrawalFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Withdrawals</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minimumAmount">Minimum Withdrawal Amount</Label>
                  <Select defaultValue="10">
                    <SelectTrigger id="minimumAmount">
                      <SelectValue placeholder="Select minimum amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">$5.00</SelectItem>
                      <SelectItem value="10">$10.00</SelectItem>
                      <SelectItem value="25">$25.00</SelectItem>
                      <SelectItem value="50">$50.00</SelectItem>
                      <SelectItem value="100">$100.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatic withdrawals will only occur when your balance exceeds this amount.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Withdrawal Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications when withdrawals are processed
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>
                  View your recent withdrawal transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <div className="flex items-center p-4 border-b bg-muted/50">
                    <div className="w-1/4 font-medium">Amount</div>
                    <div className="w-1/4 font-medium">Date</div>
                    <div className="w-1/4 font-medium">Method</div>
                    <div className="w-1/4 font-medium">Status</div>
                  </div>
                  <div className="flex items-center p-4 border-b">
                    <div className="w-1/4">$85.50</div>
                    <div className="w-1/4">Apr 1, 2025</div>
                    <div className="w-1/4">Bank Account</div>
                    <div className="w-1/4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border-b">
                    <div className="w-1/4">$92.30</div>
                    <div className="w-1/4">Mar 1, 2025</div>
                    <div className="w-1/4">Bank Account</div>
                    <div className="w-1/4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center p-4">
                    <div className="w-1/4">$78.90</div>
                    <div className="w-1/4">Feb 1, 2025</div>
                    <div className="w-1/4">Bank Account</div>
                    <div className="w-1/4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline">View All Withdrawals</Button>
                  <Button>Withdraw Now ($102.60 available)</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>
                  Overview of your subscription sharing finances.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h3>
                    <p className="text-2xl font-bold">$102.60</p>
                    <p className="text-xs text-muted-foreground">Available for withdrawal</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Revenue</h3>
                    <p className="text-2xl font-bold">$108.00</p>
                    <p className="text-xs text-muted-foreground">From shared subscriptions</p>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Expenses</h3>
                    <p className="text-2xl font-bold">$10.95</p>
                    <p className="text-xs text-muted-foreground">For joined subscriptions</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Netflix Premium (4 members)</span>
                      <span className="font-medium">$55.00/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Disney+ Standard (2 members)</span>
                      <span className="font-medium">$19.60/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ChatGPT Plus (2 members)</span>
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
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Expense Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spotify Family</span>
                      <span className="font-medium">$2.90/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notion Team</span>
                      <span className="font-medium">$3.80/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">YouTube Premium</span>
                      <span className="font-medium">$3.25/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Microsoft 365</span>
                      <span className="font-medium">$1.00/month</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Total Expenses</span>
                      <span className="font-bold">$10.95/month</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/20">
                  <h3 className="font-medium mb-2">Monthly Net Balance</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p>Monthly Revenue: <span className="font-medium text-green-600">+$102.60</span></p>
                      <p>Monthly Expenses: <span className="font-medium text-red-500">-$10.95</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Net Monthly</p>
                      <p className="text-2xl font-bold text-green-600">+$91.65</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/20">
                  <h3 className="font-medium mb-2">Annual Savings</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p>Traditional Cost: <span className="font-medium">$1,427.40/year</span></p>
                      <p>Your Net Balance: <span className="font-medium text-green-600">+$1,099.80/year</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total Benefit</p>
                      <p className="text-2xl font-bold text-green-600">$2,527.20/year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
                <CardDescription>
                  Manage your tax documentation and settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-1">Tax Reporting</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You're responsible for reporting income earned from subscription sharing according to your local tax laws.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Download Tax Summary (2024)</p>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-1">Tax Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ID/SSN</span>
                        <span className="font-medium">••••••1234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Form</span>
                        <span className="font-medium">W-9</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Update Tax Information
                    </Button>
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
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with a second verification step
                      </p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Verification Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="radio" id="sms" name="verification" className="mr-2" />
                      <Label htmlFor="sms">SMS Verification</Label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="email" name="verification" className="mr-2" />
                      <Label htmlFor="email">Email Verification</Label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="app" name="verification" className="mr-2" />
                      <Label htmlFor="app">Authenticator App</Label>
                    </div>
                  </div>
                </div>
                
                <Button>Set Up Two-Factor Authentication</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions & Devices</CardTitle>
                <CardDescription>
                  Manage your active sessions and devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Device</h3>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • New York, USA • Apr 9, 2025
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" disabled>
                      Current
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">iPhone 14 Pro</h3>
                      <p className="text-sm text-muted-foreground">
                        Safari • New York, USA • Apr 8, 2025
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Log Out
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">MacBook Pro</h3>
                      <p className="text-sm text-muted-foreground">
                        Chrome • San Francisco, USA • Apr 7, 2025
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Log Out
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out All Other Devices
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Actions that will affect your account permanently.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete your account and all associated data.
                      </p>
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