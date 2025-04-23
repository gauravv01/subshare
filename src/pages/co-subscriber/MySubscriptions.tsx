import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarDays, MoreHorizontal, Key, LogOut, Star, AlertTriangle, InfoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type SubscriptionAccess = {
  id: string;
  service: string;
  plan: string;
  profile: string;
  monthlyPrice: number;
  nextPaymentDate: string;
  status: "active" | "pending" | "expired";
  joinDate: string;
  accountHolder: {
    name: string;
    rating: number;
  };
  accessDetails?: {
    email: string;
    password: string;
    notes: string;
  };
};

const mySubscriptions: SubscriptionAccess[] = [
  {
    id: "s1",
    service: "Netflix",
    plan: "Premium",
    profile: "Profile 2",
    monthlyPrice: 4250,
    nextPaymentDate: "2025-04-15",
    status: "active",
    joinDate: "2024-10-15",
    accountHolder: {
      name: "John Kim",
      rating: 4.9,
    },
    accessDetails: {
      email: "netflix-share@example.com",
      password: "********",
      notes: "Please use Profile 2. The password changes on the 10th of each month, and you'll receive a notification when it changes."
    }
  },
  {
    id: "s2",
    service: "Notion",
    plan: "Team",
    profile: "-",
    monthlyPrice: 3800,
    nextPaymentDate: "2025-04-01",
    status: "active",
    joinDate: "2024-12-01",
    accountHolder: {
      name: "Sarah Park",
      rating: 4.8,
    },
    accessDetails: {
      email: "notion-shared@example.com",
      password: "********",
      notes: "An invitation has been sent to your email. Please log in with your own account."
    }
  },
  {
    id: "s3",
    service: "Spotify",
    plan: "Family",
    profile: "Member 3",
    monthlyPrice: 2900,
    nextPaymentDate: "2025-04-10",
    status: "active",
    joinDate: "2025-01-10",
    accountHolder: {
      name: "Emily Lee",
      rating: 4.7,
    },
    accessDetails: {
      email: "spotify-family@example.com",
      password: "********",
      notes: "Please sign up with your own account through the invitation link. Set your address to Gangnam, Seoul."
    }
  },
  {
    id: "s4",
    service: "ChatGPT Plus",
    plan: "Individual",
    profile: "-",
    monthlyPrice: 6700,
    nextPaymentDate: "-",
    status: "pending",
    joinDate: "2025-03-15",
    accountHolder: {
      name: "Julia Choi",
      rating: 4.5,
    }
  }
];

export default function MySubscriptions() {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionAccess | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  
  const viewAccessDetails = (subscription: SubscriptionAccess) => {
    setSelectedSubscription(subscription);
    setIsAccessDialogOpen(true);
  };
  
  const openLeaveDialog = (subscription: SubscriptionAccess) => {
    setSelectedSubscription(subscription);
    setIsLeaveDialogOpen(true);
  };
  
  const openRateDialog = (subscription: SubscriptionAccess) => {
    setSelectedSubscription(subscription);
    setIsRateDialogOpen(true);
  };
  
  const leaveSubscription = () => {
    console.log("Leave subscription", selectedSubscription?.id);
    alert(`Your request to leave the ${selectedSubscription?.service} subscription has been sent.`);
    setIsLeaveDialogOpen(false);
  };
  
  const submitRating = () => {
    console.log("Rating submitted", selectedSubscription?.id, rating);
    alert("Your rating has been submitted successfully.");
    setIsRateDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="co-subscriber">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage the subscription services you've joined.
          </p>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Subscriptions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {mySubscriptions
                .filter(sub => sub.status === "active")
                .map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">{subscription.service}</CardTitle>
                          <CardDescription>{subscription.plan}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewAccessDetails(subscription)}>
                              <Key className="mr-2 h-4 w-4" />
                              View Access Info
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRateDialog(subscription)}>
                              <Star className="mr-2 h-4 w-4" />
                              Rate Account Holder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openLeaveDialog(subscription)} className="text-red-600">
                              <LogOut className="mr-2 h-4 w-4" />
                              Leave Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monthly Cost</p>
                            <p className="font-medium">₩{subscription.monthlyPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Profile/Seat</p>
                            <p className="font-medium">{subscription.profile}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Next Payment</p>
                            <div className="flex items-center">
                              <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                              <p className="font-medium">{subscription.nextPaymentDate}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Account Holder</p>
                            <div className="flex items-center">
                              <p className="font-medium">{subscription.accountHolder.name}</p>
                              <div className="flex items-center ml-1 text-yellow-500">
                                <Star className="h-3 w-3" />
                                <span className="text-xs">{subscription.accountHolder.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" onClick={() => viewAccessDetails(subscription)}>
                            <Key className="mr-1 h-3.5 w-3.5" />
                            View Access Info
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {mySubscriptions
                .filter(sub => sub.status === "pending")
                .map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">{subscription.service}</CardTitle>
                          <CardDescription>{subscription.plan}</CardDescription>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monthly Cost</p>
                            <p className="font-medium">₩{subscription.monthlyPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Request Date</p>
                            <div className="flex items-center">
                              <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                              <p className="font-medium">{subscription.joinDate}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Account Holder</p>
                            <div className="flex items-center">
                              <p className="font-medium">{subscription.accountHolder.name}</p>
                              <div className="flex items-center ml-1 text-yellow-500">
                                <Star className="h-3 w-3" />
                                <span className="text-xs">{subscription.accountHolder.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                          <InfoIcon className="h-4 w-4" />
                          <AlertTitle>Pending Request</AlertTitle>
                          <AlertDescription>
                            Waiting for approval from the account holder. You'll be notified when approved.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Access Details Dialog */}
      <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
        {selectedSubscription?.accessDetails && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Access Information</DialogTitle>
              <DialogDescription>
                Access details for your {selectedSubscription.service} {selectedSubscription.plan} subscription.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Login Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Email/Username:</div>
                  <div>{selectedSubscription.accessDetails.email}</div>
                  <div className="font-medium">Password:</div>
                  <div>{selectedSubscription.accessDetails.password}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Usage Instructions</h4>
                <div className="text-sm rounded-md border p-3 bg-gray-50">
                  {selectedSubscription.accessDetails.notes}
                </div>
              </div>
              
              <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please keep access information private. Sharing with others violates the account sharing terms and may result in termination.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsAccessDialogOpen(false)}>
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Leave Subscription Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        {selectedSubscription && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Leave Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave the {selectedSubscription.service} {selectedSubscription.plan} subscription?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Your access to the subscription will be immediately terminated. Partial refunds may be possible depending on the billing status.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={leaveSubscription}>
                Confirm Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Rate Account Holder Dialog */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        {selectedSubscription && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rate Account Holder</DialogTitle>
              <DialogDescription>
                Please rate {selectedSubscription.accountHolder.name}'s service.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Rating</h4>
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`text-2xl ${
                        rating >= value ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => setRating(value)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Review (Optional)</h4>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Write your review about the account holder's service here..."
                ></textarea>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitRating}>
                Submit Rating
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}