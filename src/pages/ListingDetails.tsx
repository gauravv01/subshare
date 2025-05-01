import React, { useState, useEffect } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Star,
  CalendarDays,
  Users,
  DollarSign,
  Shield,
  Info,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Loader2
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useToast } from "../hooks/use-toast";
import { useSubscriptions } from "../context/SubscriptionProvider";
import { useMembers } from "../context/MemberProvider";
import { useTransactions } from "../context/TransactionProvider";
import { useAuth } from "../context/AuthProvider";
import { format } from "date-fns";

type PaymentMethod = "credit_card" | "paypal" | "google_pay" | "apple_pay";

export default function ListingDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscriptions, fetchSubscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { fetchMembers, isLoading: membersLoading } = useMembers();
  const { createPayment, isLoading: paymentsLoading } = useTransactions();
  
  const [subscription, setSubscription] = useState<any | null>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch subscription data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchSubscriptions();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subscription data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  // Set current subscription when data is loaded
  useEffect(() => {
    if (subscriptions.length > 0 && id) {
      const foundSubscription = subscriptions.find(sub => sub.id === id);
      setSubscription(foundSubscription);
      
      // Reset state when subscription changes
      if (foundSubscription) {
        setSeatsToBook(1);
      }
    }
  }, [id, subscriptions]);

  if (isLoading || subscriptionsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading subscription details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
            <p className="mb-6">The subscription listing you're looking for doesn't exist or has been removed.</p>
            <NavLink to="/connect">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Listings
              </Button>
            </NavLink>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get service color
  const getServiceColor = (service: any) => {
    const colors: Record<string, string> = {
      'STREAMING': "bg-red-100 text-red-600",
      'GAMING': "bg-purple-100 text-purple-600",
      'PRODUCTIVITY': "bg-blue-100 text-blue-600",
      'EDUCATION': "bg-green-100 text-green-600",
      'MUSIC': "bg-indigo-100 text-indigo-600",
      'FITNESS': "bg-orange-100 text-orange-600",
      'OTHER': "bg-gray-100 text-gray-600"
    };
    
    return colors[service?.category] || "bg-gray-100 text-gray-600";
  };
  
  // Calculate available seats
  const availableSeats = subscription.maxMembers - subscription.members.length;
  
  // Calculate price per seat
  const calculatePricePerSeat = () => {
    return subscription.price / subscription.maxMembers;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return calculatePricePerSeat() * seatsToBook;
  };
  
  // Calculate platform fee (5% in this example)
  const calculatePlatformFee = () => {
    return calculateTotalPrice() * 0.05;
  };
  
  // Calculate grand total
  const calculateGrandTotal = () => {
    return calculateTotalPrice() + calculatePlatformFee();
  };
  
  // Handle seat selection
  const handleSeatChange = (value: number) => {
    if (value >= 1 && value <= availableSeats) {
      setSeatsToBook(value);
    }
  };
  
  // Handle checkout flow
  const handleCheckoutClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a subscription.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckoutDialogOpen(true);
  };
  
  const handleProceedToPayment = () => {
    setIsCheckoutDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };
  
  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // First join the subscription
      await fetchMembers(subscription.id);
      
      // Then create a payment record
      await createPayment({
        amount: calculateGrandTotal(),
        subscriptionId: subscription.id,
        paymentMethodId: "default" // This would be the actual payment method ID in a real app
      });
      
      setIsPaymentDialogOpen(false);
      setIsConfirmationDialogOpen(true);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCloseConfirmation = () => {
    setIsConfirmationDialogOpen(false);
    
    // Show toast notification
    toast({
      title: "Success!",
      description: "You've successfully booked a seat on this subscription.",
    });
  };

  // Calculate owner rating
  const ownerRating = subscription.owner?.receivedReviews?.reduce(
    (sum: number, review: any) => sum + review.rating, 0
  ) / (subscription.owner?.receivedReviews?.length || 1) || 0;
  
  const reviewCount = subscription.owner?.receivedReviews?.length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <NavLink to="/connect">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
          </NavLink>
        </div>
        
        {/* Listing Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getServiceColor(subscription.service)}`}>
                {subscription.service?.logo ? (
                  <img 
                    src={subscription.service.logo} 
                    alt={subscription.service.name} 
                    className="w-8 h-8"
                  />
                ) : (
                  subscription.title.charAt(0)
                )}
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold">{subscription.title}</h1>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className={`mr-2 ${subscription.cycle === "MONTHLY" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                    {subscription.cycle.charAt(0) + subscription.cycle.slice(1).toLowerCase()}
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    {subscription.service?.category || 'Other'}
                  </Badge>
                  <Badge variant="outline">
                    {subscription.owner?.country || 'Global'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{subscription.description || 'No description provided'}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-primary mb-1" />
                <div className="text-sm font-medium">{availableSeats} of {subscription.maxMembers}</div>
                <div className="text-xs text-gray-500">Available Seats</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary mb-1" />
                <div className="text-sm font-medium">${calculatePricePerSeat().toFixed(2)}</div>
                <div className="text-xs text-gray-500">Per Seat/Month</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400 mb-1" />
                <div className="text-sm font-medium">{ownerRating.toFixed(1)} ({reviewCount})</div>
                <div className="text-xs text-gray-500">Host Rating</div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <CalendarDays className="h-5 w-5 text-primary mb-1" />
                <div className="text-sm font-medium">
                  {subscription.createdAt 
                    ? format(new Date(subscription.createdAt), 'MMM d, yyyy')
                    : 'Recently added'}
                </div>
                <div className="text-xs text-gray-500">Start Date</div>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="host">Host Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Subscription Plan</h3>
                    <p>{subscription.service?.name || 'Custom'} - {subscription.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Billing Cycle</h3>
                    <p>{subscription.cycle.charAt(0) + subscription.cycle.slice(1).toLowerCase()} subscription</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <p>Access starts immediately after payment</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Country</h3>
                    <p>{subscription.owner?.country || 'Global'} (content may vary by region)</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="p-4 border rounded-md mt-2">
                {subscription.service?.features?.length > 0 ? (
                  <ul className="space-y-2">
                    {subscription.service.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No features listed for this subscription.</p>
                )}
              </TabsContent>
              
              <TabsContent value="host" className="p-4 border rounded-md mt-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {subscription.owner?.avatar ? (
                        <img 
                          src={subscription.owner.avatar} 
                          alt={subscription.owner.name} 
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span>{subscription.owner?.name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{subscription.owner?.name || 'Anonymous'}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{ownerRating.toFixed(1)} ({reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Host Guidelines</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>The host is responsible for managing the subscription account.</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>You'll receive access credentials after your payment is confirmed.</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>The host has agreed to our terms regarding subscription sharing.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Booking card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Your Seat</CardTitle>
                <CardDescription>Join this subscription share</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Pricing</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per seat</span>
                        <span className="font-medium">${calculatePricePerSeat().toFixed(2)}/month</span>
                      </div>
                      {subscription.cycle === "YEARLY" && (
                        <div className="text-xs text-gray-500 mb-2">
                          Billed as ${(calculatePricePerSeat() * 12).toFixed(2)} annually
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Available seats</span>
                        <span className="font-medium">{availableSeats} of {subscription.maxMembers}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Number of Seats</h3>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSeatChange(seatsToBook - 1)}
                        disabled={seatsToBook <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-4 font-medium">{seatsToBook}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSeatChange(seatsToBook + 1)}
                        disabled={seatsToBook >= availableSeats}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Platform fee (5%)</span>
                      <span>${calculatePlatformFee().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateGrandTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {subscription.cycle === "MONTHLY" ? "Billed monthly" : "Billed annually"}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  className="w-full mb-3" 
                  onClick={handleCheckoutClick}
                  disabled={availableSeats === 0}
                >
                  {availableSeats === 0 ? "No Seats Available" : "Book Now"}
                </Button>
                <div className="w-full flex items-center justify-center text-xs text-gray-500">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Secure payment process</span>
                </div>
              </CardFooter>
            </Card>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="guarantees">
                <AccordionTrigger>Our Guarantees</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Secure payments with full encryption</span>
                    </div>
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>14-day money-back guarantee if you can't access the service</span>
                    </div>
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>24/7 support for any issues with your subscription</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Review the details before proceeding to payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getServiceColor(subscription.service)}`}>
                    {subscription.service?.logo ? (
                      <img 
                        src={subscription.service.logo} 
                        alt={subscription.service.name} 
                        className="w-6 h-6"
                      />
                    ) : (
                      subscription.title.charAt(0)
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{subscription.title}</h3>
                    <p className="text-sm text-gray-500">
                      {seatsToBook} seat{seatsToBook > 1 ? 's' : ''} in a {subscription.maxMembers}-person share
                    </p>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per seat</span>
                    <span>${calculatePricePerSeat().toFixed(2)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of seats</span>
                    <span>{seatsToBook}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee (5%)</span>
                    <span>${calculatePlatformFee().toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${calculateGrandTotal().toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {subscription.cycle === "MONTHLY" ? "Billed monthly" : "Billed annually"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Important Information</h3>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Your access will be active immediately after payment</span>
                  </li>
                  <li className="flex items-start">
                    <Info className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>You'll receive credentials via email after payment</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Cancellation policy: 7-day notice required to cancel subscription</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
              Back
            </Button>
            <Button onClick={handleProceedToPayment}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Choose your payment method
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup 
              value={selectedPaymentMethod} 
              onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="credit_card" id="credit_card" />
                <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>Credit/Debit Card</span>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-blue-500 rounded"></div>
                      <div className="w-8 h-5 bg-red-500 rounded"></div>
                      <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span>PayPal</span>
                    <div className="w-10 h-5 bg-blue-600 rounded flex items-center justify-center text-xs text-white font-bold">
                      PayPal
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="google_pay" id="google_pay" />
                <Label htmlFor="google_pay" className="flex-1 cursor-pointer">Google Pay</Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="apple_pay" id="apple_pay" />
                <Label htmlFor="apple_pay" className="flex-1 cursor-pointer">Apple Pay</Label>
              </div>
            </RadioGroup>

            <div className="mt-6 bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Total payment</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Back
            </Button>
            <Button onClick={handleProcessPayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="mr-2">Processing...</span>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Complete Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Your booking has been confirmed
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 p-4 rounded-md">
                <h3 className="font-medium text-green-700 mb-2">Booking Confirmed</h3>
                <p className="text-sm text-green-600">
                  You've successfully booked {seatsToBook} seat{seatsToBook > 1 ? 's' : ''} on the {subscription.title} subscription.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">What happens next?</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">1</span>
                    <span>You'll receive a confirmation email with your booking details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">2</span>
                    <span>Your account holder will share access credentials shortly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2">3</span>
                    <span>You can view and manage all your subscriptions in your dashboard</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-500">
                Booking reference: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                View My Subscriptions
              </Link>
            </Button>
            <Button onClick={handleCloseConfirmation}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}