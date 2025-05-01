import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare,
  Shield,
  Check,
  AlertCircle,
  Loader2,
  CreditCard,
  Landmark
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import { useSubscriptions } from "../context/SubscriptionProvider";
import { useMembers } from "../context/MemberProvider";
import { useAuth } from "../context/AuthProvider";
import { formatCycle } from "../utils/formatters";
import { format } from "date-fns";
import axiosInstance from "../lib/axiosInstance";
import { useTransactions } from "../context/TransactionProvider";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchSubscriptions, joinSubscription } = useSubscriptions();
  const { fetchTransactions, createPayment } = useTransactions();
  
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [defaultPaymentMethods] = useState([
    {
      id: 'credit-card',
      type: 'Credit Card',
      provider: 'Visa/Mastercard',
      icon: 'credit-card'
    },
    {
      id: 'paypal',
      type: 'PayPal',
      provider: 'Online Payment',
      icon: 'paypal'
    },
    {
      id: 'bank-transfer',
      type: 'Bank Transfer',
      provider: 'Direct Debit',
      icon: 'bank'
    }
  ]);
  
  // Fetch subscription details
  useEffect(() => {
    const loadSubscription = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/subscriptions/${id}`);
        setSubscription(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subscription details. Please try again.",
          variant: "destructive",
        });
        navigate("/find-subscriptions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubscription();
  }, [id, navigate, toast]);
  
  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      setIsLoadingPaymentMethods(true);
      
      // Try to fetch saved payment methods
      try {
        const response = await axiosInstance.get('/payment-methods');
        if (response.data && response.data.length > 0) {
          setPaymentMethods(response.data);
          setSelectedPaymentMethod(response.data[0].id);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch saved payment methods:', error);
      }
      
      // If no saved methods or error, use default methods
      setPaymentMethods(defaultPaymentMethods);
      setSelectedPaymentMethod(defaultPaymentMethods[0].id);
    } catch (error) {
      console.error('Failed to set up payment methods:', error);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };
  
  // Handle joining subscription
  const handleJoinSubscription = async () => {
    if (!id || !user) return;
    
    // Open payment dialog instead of immediately joining
    setIsPaymentDialogOpen(true);
    fetchPaymentMethods();
  };
  
  // Handle payment and join process
  const handlePaymentAndJoin = async () => {
    if (!id || !user || !selectedPaymentMethod) return;
    
    try {
      setIsJoining(true);
      
      // Simplify the payment data structure
      const paymentData = {
        amount: subscription.price / subscription.maxMembers,
        userId: user.id,
        subscriptionId: id,
        paymentMethodId: selectedPaymentMethod,
        description: `Payment for ${subscription.title} subscription`
      };
      
      // Create payment transaction
      // await createPayment(paymentData);
      
      // Join the subscription
      await joinSubscription(id);
      
      // Refresh data
      await fetchTransactions();
      await fetchSubscriptions();
      
      // Close payment dialog
      setIsPaymentDialogOpen(false);
      
      toast({
        title: "Success",
        description: "You have successfully joined this subscription.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to join subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  // Handle sending message to owner
  const handleSendMessage = async () => {
    if (!messageText.trim() || !subscription?.owner?.id) return;
    
    try {
      await axiosInstance.post('/messages', {
        receiverId: subscription.owner.id,
        content: messageText,
        type: 'TEXT'
      });
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the subscription owner.",
      });
      
      setMessageText("");
      setIsMessageDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Check if user is already a member
  const isUserMember = subscription?.members?.some((member: any) => member.userId === user?.id);
  
  // Check if user is the owner
  const isUserOwner = subscription?.ownerId === user?.id;
  
  // Calculate average rating
  const averageRating = subscription?.owner?.receivedReviews?.length > 0
    ? subscription.owner.receivedReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / subscription.owner.receivedReviews.length
    : 0;
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading subscription details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!subscription) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Subscription Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The subscription you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/find-subscriptions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/find-subscriptions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{subscription.title}</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{subscription.title}</CardTitle>
                    <CardDescription>
                      {subscription.service?.name || "Custom Subscription"}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>
                      {subscription.status}
                    </Badge>
                    <Badge variant="outline">
                      {subscription.visibility}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service Logo */}
                {subscription.service?.logo && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={subscription.service.logo} 
                      alt={subscription.service.name} 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                
                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {subscription.description || "No description provided."}
                  </p>
                </div>
                
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-sm text-muted-foreground">
                        ${subscription.price} / {formatCycle(subscription.cycle)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Members</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.members?.length || 0} / {subscription.maxMembers}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Profile Assignment</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.profileAssignment || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Your share:</span>
                      <span className="font-medium">${(subscription.price / subscription.maxMembers).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing cycle:</span>
                      <span>{formatCycle(subscription.cycle)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>First payment:</span>
                      <span>Today</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total subscription cost:</span>
                      <span>${subscription.price.toFixed(2)} / {formatCycle(subscription.cycle)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  {!isUserMember && !isUserOwner ? (
                    <Button 
                      className="flex-1" 
                      onClick={handleJoinSubscription}
                      disabled={subscription.members?.length >= subscription.maxMembers}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Join Subscription
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1" 
                      variant="secondary"
                      onClick={() => navigate("/dashboard")}
                    >
                      View in Dashboard
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMessageDialogOpen(true)}
                    disabled={isUserOwner}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Owner
                  </Button>
                </div>
                
                {subscription.members?.length >= subscription.maxMembers && !isUserMember && !isUserOwner && (
                  <p className="text-sm text-destructive mt-2">
                    This subscription has reached its maximum number of members.
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Tabs for additional info */}
            <Tabs defaultValue="members">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Members ({subscription.members?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subscription.members?.length > 0 ? (
                      <div className="space-y-4">
                        {subscription.members.map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.user?.avatar} />
                                <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.user?.name || "Unknown User"}</p>
                                <p className="text-sm text-muted-foreground">
                                  Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <Badge variant={member.role === "OWNER" ? "default" : "outline"}>
                              {member.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No members have joined this subscription yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Owner Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subscription.owner?.receivedReviews?.length > 0 ? (
                      <div className="space-y-4">
                        {subscription.owner.receivedReviews.map((review: any) => (
                          <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={review.author?.avatar} />
                                  <AvatarFallback>{review.author?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{review.author?.name || "Anonymous"}</span>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.content || "No comment provided."}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No reviews available for this subscription owner.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={subscription.owner?.avatar} />
                    <AvatarFallback>{subscription.owner?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{subscription.owner?.name || "Unknown User"}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {subscription.owner?.country || "Location not specified"}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({subscription.owner?.receivedReviews?.length || 0} reviews)
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsMessageDialogOpen(true)}
                    disabled={isUserOwner}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Service Details */}
            {subscription.service && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    {subscription.service.logo && (
                      <img 
                        src={subscription.service.logo} 
                        alt={subscription.service.name} 
                        className="h-12 mb-4 object-contain"
                      />
                    )}
                    <h3 className="font-medium">{subscription.service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {subscription.service.category || "Miscellaneous"}
                    </p>
                    
                    {subscription.service.website && (
                      <Button 
                        variant="outline" 
                        className="w-full text-sm"
                        onClick={() => window.open(subscription.service.website, '_blank')}
                      >
                        Visit Service Website
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay for this subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Payment Summary */}
            <div className="p-4 bg-muted rounded-md mb-4">
              <h3 className="font-medium mb-2">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subscription:</span>
                  <span>{subscription.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your share:</span>
                  <span className="font-medium">${(subscription.price / subscription.maxMembers).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing cycle:</span>
                  <span>{formatCycle(subscription.cycle)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            {isLoadingPaymentMethods ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <RadioGroup value={selectedPaymentMethod || ""} onValueChange={setSelectedPaymentMethod}>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{method.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.provider} {method.lastFour ? `•••• ${method.lastFour}` : ''}
                            </p>
                          </div>
                          {method.icon && (
                            <div className="text-muted-foreground">
                              {method.icon === 'credit-card' && <CreditCard className="h-5 w-5" />}
                              {method.icon === 'paypal' && <div className="font-bold text-blue-600">PayPal</div>}
                              {method.icon === 'bank' && <Landmark className="h-5 w-5" />}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePaymentAndJoin} 
              disabled={isJoining || !selectedPaymentMethod}
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message the Owner</DialogTitle>
            <DialogDescription>
              Send a message to {subscription.owner?.name || "the subscription owner"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <textarea
              className="w-full min-h-[120px] p-3 border rounded-md"
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}