import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Star, Users, Calendar, Info } from "lucide-react";

type Subscription = {
  id: string;
  service: string;
  plan: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  billingCycle: "Monthly" | "Yearly";
  accountHolder: {
    name: string;
    rating: number;
    reviews: number;
  };
};

const subscriptions: Subscription[] = [
  {
    id: "1",
    service: "Netflix",
    plan: "Premium",
    availableSeats: 1,
    totalSeats: 4,
    pricePerSeat: 4250,
    billingCycle: "Monthly",
    accountHolder: {
      name: "John Miller",
      rating: 4.8,
      reviews: 32,
    },
  },
  {
    id: "2",
    service: "Netflix",
    plan: "Standard",
    availableSeats: 1,
    totalSeats: 2,
    pricePerSeat: 3900,
    billingCycle: "Monthly",
    accountHolder: {
      name: "Emma Wilson",
      rating: 4.9,
      reviews: 45,
    },
  },
  {
    id: "3",
    service: "Disney+",
    plan: "Standard",
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: 3500,
    billingCycle: "Monthly",
    accountHolder: {
      name: "Michael Zhang",
      rating: 4.7,
      reviews: 21,
    },
  },
  {
    id: "4",
    service: "Spotify",
    plan: "Family",
    availableSeats: 1,
    totalSeats: 6,
    pricePerSeat: 2900,
    billingCycle: "Monthly",
    accountHolder: {
      name: "Sarah Park",
      rating: 4.6,
      reviews: 18,
    },
  },
  {
    id: "5",
    service: "YouTube Premium",
    plan: "Family",
    availableSeats: 3,
    totalSeats: 5,
    pricePerSeat: 2800,
    billingCycle: "Monthly",
    accountHolder: {
      name: "David Chen",
      rating: 4.5,
      reviews: 12,
    },
  },
  {
    id: "6",
    service: "ChatGPT Plus",
    plan: "Individual",
    availableSeats: 1,
    totalSeats: 3,
    pricePerSeat: 6700,
    billingCycle: "Monthly",
    accountHolder: {
      name: "Jennifer Liu",
      rating: 4.4,
      reviews: 9,
    },
  },
  {
    id: "7",
    service: "Notion",
    plan: "Team",
    availableSeats: 2,
    totalSeats: 5,
    pricePerSeat: 4800,
    billingCycle: "Yearly",
    accountHolder: {
      name: "Robert Kim",
      rating: 4.8,
      reviews: 27,
    },
  },
  {
    id: "8",
    service: "Microsoft 365",
    plan: "Family",
    availableSeats: 3,
    totalSeats: 6,
    pricePerSeat: 2900,
    billingCycle: "Yearly",
    accountHolder: {
      name: "Olivia Yoon",
      rating: 4.9,
      reviews: 38,
    },
  },
];

export default function FindSubscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const joinSubscription = (subscription: Subscription) => {
    console.log("Join subscription", subscription);
    alert(`Your request to join ${subscription.service} ${subscription.plan} has been sent.`);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="co-subscriber">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find Subscriptions</h1>
          <p className="text-muted-foreground">
            Find and join subscriptions that interest you.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services or plans"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="netflix">Netflix</SelectItem>
              <SelectItem value="disney">Disney+</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="youtube">YouTube Premium</SelectItem>
              <SelectItem value="chatgpt">ChatGPT Plus</SelectItem>
              <SelectItem value="notion">Notion</SelectItem>
              <SelectItem value="office">Microsoft 365</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
            <TabsTrigger value="productivity">Work & Productivity</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onJoin={() => {
                    setSelectedSubscription(subscription);
                    setIsDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="entertainment" className="space-y-4 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions
                .filter(sub => ["Netflix", "Disney+", "Spotify", "YouTube Premium"].includes(sub.service))
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onJoin={() => {
                      setSelectedSubscription(subscription);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="productivity" className="space-y-4 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions
                .filter(sub => ["Notion", "Microsoft 365"].includes(sub.service))
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onJoin={() => {
                      setSelectedSubscription(subscription);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="education" className="space-y-4 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubscriptions
                .filter(sub => ["ChatGPT Plus"].includes(sub.service))
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onJoin={() => {
                      setSelectedSubscription(subscription);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedSubscription && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Join Subscription</DialogTitle>
              <DialogDescription>
                Would you like to join this subscription?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">{selectedSubscription.service} {selectedSubscription.plan}</h3>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {selectedSubscription.availableSeats}/{selectedSubscription.totalSeats} seats
                  </div>
                </div>
                <Badge className="text-lg font-medium px-3 py-1">
                  ${selectedSubscription.pricePerSeat.toLocaleString()}/mo
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Account Holder</Label>
                <div className="flex items-center justify-between">
                  <div className="font-medium">{selectedSubscription.accountHolder.name}</div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">
                      {selectedSubscription.accountHolder.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({selectedSubscription.accountHolder.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Payment Details</Label>
                <div className="flex flex-col space-y-2 text-sm rounded-md border p-4">
                  <div className="flex justify-between">
                    <span>Price per seat</span>
                    <span className="font-medium">${selectedSubscription.pricePerSeat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing cycle</span>
                    <span className="font-medium">{selectedSubscription.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First payment date</span>
                    <span className="font-medium">2025-03-18</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="font-medium">Total payment</span>
                    <span className="font-bold">${selectedSubscription.pricePerSeat.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start bg-amber-50 p-4 rounded-md border border-amber-200">
                <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Before joining</p>
                  <p className="text-amber-700 mt-1">
                    Payment will be processed after your join request is approved. You'll receive account access details after approval. 
                    You can leave approved subscriptions at any time.
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => joinSubscription(selectedSubscription)}>
                Request to Join
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onJoin: () => void;
}

function SubscriptionCard({ subscription, onJoin }: SubscriptionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{subscription.service}</CardTitle>
            <CardDescription>{subscription.plan}</CardDescription>
          </div>
          <Badge>{subscription.billingCycle}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{subscription.availableSeats}/{subscription.totalSeats} seats</span>
            </div>
            <div className="text-xl font-bold">
              ${subscription.pricePerSeat.toLocaleString()}/mo
            </div>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Account Holder</span>
              <span className="font-medium">{subscription.accountHolder.name}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{subscription.accountHolder.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({subscription.accountHolder.reviews})
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onJoin} className="w-full">
          Join
        </Button>
      </CardFooter>
    </Card>
  );
}