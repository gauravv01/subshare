import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MoreHorizontal, 
  Search, 
  Plus, 
  Settings,
  Edit,
  Trash,
  ImagePlus,
  Check,
  X,
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Types
type ServiceCategory = "entertainment" | "productivity" | "education" | "other";
type PlanType = "basic" | "standard" | "premium" | "custom";
type ServiceStatus = "active" | "inactive" | "pending-review";

interface ServicePlan {
  id: string;
  name: string;
  maxUsers: number;
  price: number;
  recurrence: "monthly" | "yearly";
  features: string[];
}

interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  status: ServiceStatus;
  description: string;
  logoUrl: string;
  plans: ServicePlan[];
  availableCountries: string[];
  featured: boolean;
  onboardingInstructions: string;
}

export default function ManageServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ServicePlan | null>(null);
  
  // Sample service data
  const services: Service[] = [
    {
      id: "1",
      name: "Netflix",
      category: "entertainment",
      status: "active",
      description: "Stream TV shows and movies online or stream right to your smart TV, game console, PC, Mac, mobile, tablet, and more.",
      logoUrl: "/logos/netflix.svg",
      plans: [
        {
          id: "1-1",
          name: "Basic",
          maxUsers: 1,
          price: 9.99,
          recurrence: "monthly",
          features: ["SD Video Quality", "Watch on 1 device at a time", "No ads"],
        },
        {
          id: "1-2",
          name: "Standard",
          maxUsers: 2,
          price: 15.49,
          recurrence: "monthly",
          features: ["HD Video Quality", "Watch on 2 devices at a time", "No ads"],
        },
        {
          id: "1-3",
          name: "Premium",
          maxUsers: 4,
          price: 19.99,
          recurrence: "monthly",
          features: ["4K+HDR Video Quality", "Watch on 4 devices at a time", "No ads", "Downloadable content"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "JP", "KR", "DE", "FR", "IT", "BR"],
      featured: true,
      onboardingInstructions: "1. Create your account\n2. Choose your plan\n3. Create payment method\n4. Set up profiles for members\n5. Share login details with members",
    },
    {
      id: "2",
      name: "Spotify",
      category: "entertainment",
      status: "active",
      description: "Digital music service that gives you access to millions of songs. Listen to the songs and podcasts you love and discover new music.",
      logoUrl: "/logos/spotify.svg",
      plans: [
        {
          id: "2-1",
          name: "Individual",
          maxUsers: 1,
          price: 9.99,
          recurrence: "monthly",
          features: ["Ad-free music listening", "Play anywhere", "On-demand playback"],
        },
        {
          id: "2-2",
          name: "Duo",
          maxUsers: 2,
          price: 12.99,
          recurrence: "monthly",
          features: ["2 Premium accounts", "Ad-free music listening", "Individual accounts", "Duo Mix"],
        },
        {
          id: "2-3",
          name: "Family",
          maxUsers: 6,
          price: 15.99,
          recurrence: "monthly",
          features: ["6 Premium accounts", "Block explicit music", "Family Mix", "Spotify Kids"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "JP", "KR", "DE", "FR", "IT", "BR"],
      featured: true,
      onboardingInstructions: "1. Set up Spotify account\n2. Make payment\n3. Create family group\n4. Invite members\n5. Each member creates their profile",
    },
    {
      id: "3",
      name: "Microsoft 365",
      category: "productivity",
      status: "active",
      description: "Productivity cloud that brings together best-in-class Office apps with powerful cloud services, device management, and advanced security.",
      logoUrl: "/logos/microsoft.svg",
      plans: [
        {
          id: "3-1",
          name: "Personal",
          maxUsers: 1,
          price: 69.99,
          recurrence: "yearly",
          features: ["Premium Office apps", "1TB OneDrive cloud storage", "Ad-free Outlook"],
        },
        {
          id: "3-2",
          name: "Family",
          maxUsers: 6,
          price: 99.99,
          recurrence: "yearly",
          features: ["For 6 people", "Works on Windows, macOS, iOS, and Android", "Each user gets 1TB of storage", "MS Office license", "Advanced security"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "JP", "KR", "DE", "FR", "IT", "BR"],
      featured: false,
      onboardingInstructions: "1. Create Microsoft account\n2. Purchase subscription\n3. Install Office apps on devices\n4. Invite family members\n5. Set up OneDrive folders",
    },
    {
      id: "4",
      name: "ChatGPT Plus",
      category: "productivity",
      status: "active",
      description: "Premium access to ChatGPT with faster response times and priority access during peak times.",
      logoUrl: "/logos/chatgpt.svg",
      plans: [
        {
          id: "4-1",
          name: "Premium",
          maxUsers: 1,
          price: 20.00,
          recurrence: "monthly",
          features: ["Access to GPT-4", "Priority access during peak times", "Faster response time", "Early access to new features"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "JP", "KR", "DE", "FR", "IT"],
      featured: true,
      onboardingInstructions: "1. Create OpenAI account\n2. Subscribe to ChatGPT Plus\n3. Share login credentials\n4. Create usage schedule for members",
    },
    {
      id: "5",
      name: "Adobe Creative Cloud",
      category: "productivity",
      status: "inactive",
      description: "Collection of creative desktop and mobile apps for photography, design, video, web, UX, and more.",
      logoUrl: "/logos/adobe.svg",
      plans: [
        {
          id: "5-1",
          name: "Photography",
          maxUsers: 1,
          price: 9.99,
          recurrence: "monthly",
          features: ["Lightroom", "Photoshop", "20GB cloud storage"],
        },
        {
          id: "5-2",
          name: "All Apps",
          maxUsers: 1,
          price: 52.99,
          recurrence: "monthly",
          features: ["20+ creative apps including Photoshop, Illustrator, and Premiere Pro", "100GB cloud storage", "Adobe Fonts"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "DE", "FR", "IT"],
      featured: false,
      onboardingInstructions: "1. Create Adobe ID\n2. Purchase subscription\n3. Install desktop apps\n4. Share login credentials\n5. Create usage schedule",
    },
    {
      id: "6",
      name: "Udemy Pro",
      category: "education",
      status: "pending-review",
      description: "Online learning platform with thousands of courses on programming, data science, business, and more.",
      logoUrl: "/logos/udemy.svg",
      plans: [
        {
          id: "6-1",
          name: "Personal Plan",
          maxUsers: 1,
          price: 29.99,
          recurrence: "monthly",
          features: ["Access to 7,000+ courses", "Offline viewing", "Certification", "Practice tests"],
        },
      ],
      availableCountries: ["US", "UK", "CA", "AU", "JP", "KR", "DE", "FR", "IT", "BR", "IN"],
      featured: false,
      onboardingInstructions: "1. Create Udemy account\n2. Subscribe to Personal Plan\n3. Share login credentials\n4. Create usage schedule for members",
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesStatus = !selectedStatus || service.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddNewService = () => {
    setIsNewService(true);
    setCurrentService({
      id: String(services.length + 1),
      name: "",
      category: "entertainment",
      status: "pending-review",
      description: "",
      logoUrl: "",
      plans: [],
      availableCountries: [],
      featured: false,
      onboardingInstructions: "",
    });
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setIsNewService(false);
    setCurrentService(service);
    setIsServiceDialogOpen(true);
  };

  const handleAddNewPlan = () => {
    if (!currentService) return;
    
    setCurrentPlan({
      id: `${currentService.id}-${currentService.plans.length + 1}`,
      name: "",
      maxUsers: 1,
      price: 0,
      recurrence: "monthly",
      features: [],
    });
    setIsPlanDialogOpen(true);
  };

  const handleEditPlan = (plan: ServicePlan) => {
    setCurrentPlan(plan);
    setIsPlanDialogOpen(true);
  };

  const getCategoryLabel = (category: ServiceCategory) => {
    switch (category) {
      case "entertainment":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Entertainment</Badge>;
      case "productivity":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Productivity</Badge>;
      case "education":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Education</Badge>;
      case "other":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Other</Badge>;
    }
  };
  
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "pending-review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Management</h1>
          <p className="text-muted-foreground">
            Configure and manage services available for subscription sharing
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>
                  All services configured for the platform
                </CardDescription>
              </div>
              <Button onClick={handleAddNewService}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services List */}
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Service</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Plans</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Featured</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr 
                          key={service.id} 
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                {service.logoUrl ? (
                                  <img 
                                    src={service.logoUrl} 
                                    alt={service.name} 
                                    className="h-6 w-6 object-contain"
                                  />
                                ) : (
                                  <Settings className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {service.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {getCategoryLabel(service.category)}
                          </td>
                          <td className="p-4 align-middle">
                            {getStatusBadge(service.status)}
                          </td>
                          <td className="p-4 align-middle">
                            {service.plans.length}
                          </td>
                          <td className="p-4 align-middle">
                            {service.featured ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                          </td>
                          <td className="p-4 text-right align-middle">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditService(service)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Service</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {service.status === "active" ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      <span>Deactivate</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      <span>Activate</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {service.featured ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      <span>Remove from Featured</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      <span>Add to Featured</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Delete Service</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Dialog */}
        {currentService && (
          <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>
                  {isNewService ? "Add New Service" : `Edit ${currentService.name}`}
                </DialogTitle>
                <DialogDescription>
                  {isNewService 
                    ? "Configure a new service for the platform" 
                    : "Update service configuration and plans"}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Service Details</TabsTrigger>
                  <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Netflix, Spotify"
                        value={currentService.name}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={currentService.category}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={currentService.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending-review">Pending Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="logoUrl"
                          placeholder="/logos/service.svg"
                          value={currentService.logoUrl}
                        />
                        <Button size="icon" variant="outline">
                          <ImagePlus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a brief description of the service"
                        value={currentService.description}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="onboarding">Onboarding Instructions</Label>
                      <Textarea
                        id="onboarding"
                        placeholder="Step-by-step instructions for setting up and sharing this service"
                        value={currentService.onboardingInstructions}
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="featured" checked={currentService.featured} />
                      <Label htmlFor="featured">Feature this service on the homepage</Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="plans" className="space-y-4 py-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Subscription Plans</h3>
                    <Button size="sm" onClick={handleAddNewPlan}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Plan
                    </Button>
                  </div>
                  
                  {currentService.plans.length === 0 ? (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">No plans configured yet.</p>
                      <Button variant="outline" className="mt-4" onClick={handleAddNewPlan}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Plan
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentService.plans.map((plan) => (
                        <div 
                          key={plan.id} 
                          className="flex items-center justify-between rounded-md border p-4"
                        >
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {plan.maxUsers} users | ${plan.price}/{plan.recurrence === "monthly" ? "mo" : "yr"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" asChild>
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Plan Dialog */}
        {currentPlan && (
          <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {currentPlan.name ? `Edit ${currentPlan.name} Plan` : "Add New Plan"}
                </DialogTitle>
                <DialogDescription>
                  Configure subscription plan details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      placeholder="e.g. Basic, Premium"
                      value={currentPlan.name}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Max Users</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      min="1"
                      value={currentPlan.maxUsers}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentPlan.price}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Billing Cycle</Label>
                    <Select value={currentPlan.recurrence}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="rounded-md border">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between border-b p-2 last:border-0">
                        <span>{feature}</span>
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center p-2">
                      <Input placeholder="Add a feature..." className="border-0 shadow-none" />
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" asChild>
                  <DialogClose>Cancel</DialogClose>
                </Button>
                <Button>Save Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}