import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
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
  Loader2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";

// API Services
import { useServices } from "../../context/ServiceProvider";

// Types
type ServiceCategory = "entertainment" | "productivity" | "education" | "other";
type PlanType = "basic" | "standard" | "premium" | "custom";
type ServiceStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "REVIEW";

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
  description: string;
  website?: string;
  logo?: string;
  category: 'STREAMING' | 'GAMING' | 'PRODUCTIVITY' | 'EDUCATION' | 'MUSIC' | 'FITNESS' | 'OTHER';
  maxMembers?: number;
  termsUrl?: string;
  privacyUrl?: string;
  supportUrl?: string;
  features: string[];
  allowedCountries: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REVIEW';
  featured: boolean;
  plans: Array<{
    id: string;
    name: string;
    price: number;
    cycle: string;
    features: string[];
    maxMembers: number;
  }>;
}

export default function ManageServices() {
  const { toast } = useToast();
  const { services, fetchServices, addService, updateService, deleteService, addServicePlan, updateServicePlan, deleteServicePlan, updateServiceStatus, updateServiceFeatured } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ServicePlan | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        await fetchServices();
      } catch (error) {
        toast({
          title: "Error loading services",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServices();
  }, [fetchServices, toast]);

  // Service handlers
  const handleAddNewService = () => {
    setCurrentService({
      id: "",
      name: "",
      description: "",
      website: undefined,
      logo: undefined,
      category: "OTHER",
      maxMembers: undefined,
      termsUrl: undefined,
      privacyUrl: undefined,
      supportUrl: undefined,
      features: [],
      allowedCountries: [],
      status: "INACTIVE",
      featured: false,
      plans: [],
    });
    setIsNewService(true);
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService({ ...service });
    setIsNewService(false);
    setIsServiceDialogOpen(true);
  };

  const handleToggleStatus = async (service: Service) => {
    setIsSubmitting(true);
    try {
      const newStatus: ServiceStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateServiceStatus(service.id, newStatus);
      toast({
        title: "Service updated",
        description: `${service.name} is now ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error updating service",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    setIsSubmitting(true);
    try {
      await updateServiceFeatured(service.id, !service.featured);
      toast({
        title: "Service updated",
        description: service.featured 
          ? `${service.name} removed from featured services` 
          : `${service.name} added to featured services`,
      });
    } catch (error) {
      toast({
        title: "Error updating service",
        description: "Failed to update featured status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setPlanToDelete(null);
    setDeleteDialogOpen(true);
  };

  const handleServiceInputChange = (field: keyof Service, value: any) => {
    if (currentService) {
      setCurrentService({
        ...currentService,
        [field]: value
      });
    }
  };

  const handleSaveService = async () => {
    if (!currentService) return;
    
    setIsSubmitting(true);
    try {
      if (isNewService) {
        await addService(currentService);
        toast({
          title: "Service created",
          description: `${currentService.name} has been created successfully`,
        });
      } else {
        await updateService(currentService);
        toast({
          title: "Service updated",
          description: `${currentService.name} has been updated successfully`,
        });
      }
      setIsServiceDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error saving service",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setIsSubmitting(true);
    try {
      await deleteService(serviceToDelete);
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error deleting service",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setServiceToDelete(null);
    }
  };

  // Plan handlers
  const handleAddNewPlan = () => {
    if (!currentService) return;
    
    setCurrentPlan({
      id: "",
      name: "",
      maxUsers: 1,
      price: 0,
      recurrence: "monthly",
      features: []
    });
    setIsPlanDialogOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setCurrentPlan({
      id: plan.id,
      name: plan.name,
      maxUsers: plan.maxMembers,
      price: plan.price,
      recurrence: plan.cycle?.toLowerCase() === "MONTHLY" ? "monthly" : "yearly",
      features: plan.features || []
    });
    setIsPlanDialogOpen(true);
  };

  const confirmDeletePlan = (serviceId: string, planId: string) => {
    setServiceToDelete(serviceId);
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handlePlanInputChange = (field: keyof ServicePlan, value: any) => {
    if (currentPlan) {
      setCurrentPlan({
        ...currentPlan,
        [field]: value
      });
    }
  };

  const handleAddFeature = () => {
    if (!currentPlan || !newFeature.trim()) return;
    
    setCurrentPlan({
      ...currentPlan,
      features: [...currentPlan.features, newFeature.trim()]
    });
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      features: currentPlan.features.filter((_, i) => i !== index)
    });
  };

  const handleSavePlan = async () => {
    if (!currentService || !currentPlan) return;
    
    // Convert UI format to API format
    const apiPlan = {
      id: currentPlan.id,
      name: currentPlan.name,
      maxMembers: currentPlan.maxUsers,
      price: currentPlan.price,
      cycle: currentPlan.recurrence.toUpperCase(),
      features: currentPlan.features
    };
    
    setIsSubmitting(true);
    try {
      if (!currentPlan.id) {
        await addServicePlan(currentService.id, apiPlan);
        toast({
          title: "Plan added",
          description: `${currentPlan.name} plan has been added to ${currentService.name}`,
        });
      } else {
        await updateServicePlan(currentService.id, currentPlan.id, apiPlan);
        toast({
          title: "Plan updated",
          description: `${currentPlan.name} plan has been updated`,
        });
      }
      setIsPlanDialogOpen(false);
      
      // Refresh the current service to show updated plans
      if (!isNewService) {
        const updatedServices:any = await fetchServices();
        const refreshedService = updatedServices.find(s => s.id === currentService.id);
        if (refreshedService) {
          setCurrentService(refreshedService);
        }
      }
    } catch (error) {
      toast({
        title: "Error saving plan",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!serviceToDelete || !planToDelete) return;
    
    setIsSubmitting(true);
    try {
      await deleteServicePlan(serviceToDelete, planToDelete);
      toast({
        title: "Plan deleted",
        description: "The plan has been deleted successfully",
      });
      
      // Refresh the current service to show updated plans
      if (currentService && currentService.id === serviceToDelete) {
        const updatedServices:any = await fetchServices();
        const refreshedService = updatedServices.find(s => s.id === serviceToDelete);
        if (refreshedService) {
          setCurrentService(refreshedService);
        }
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error deleting plan",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setServiceToDelete(null);
      setPlanToDelete(null);
    }
  };

  const filteredServices = services
    .filter(service => {
      // Search filter
      if (searchTerm && !service.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !service.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && service.category !== selectedCategory.toUpperCase()) {
        return false;
      }
      
      // Status filter
      if (selectedStatus && service.status !== selectedStatus) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "STREAMING":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Streaming</Badge>;
      case "GAMING":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gaming</Badge>;
      case "PRODUCTIVITY":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Productivity</Badge>;
      case "EDUCATION":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Education</Badge>;
      case "MUSIC":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Music</Badge>;
      case "FITNESS":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Fitness</Badge>;
      case "OTHER":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Other</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
    }
  };
  
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Review</Badge>;
      case "REVIEW":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Review</Badge>;
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
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="STREAMING">Streaming</SelectItem>
                    <SelectItem value="GAMING">Gaming</SelectItem>
                    <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                    <SelectItem value="MUSIC">Music</SelectItem>
                    <SelectItem value="FITNESS">Fitness</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services List */}
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading services...</p>
                    </div>
                  ) : filteredServices.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No services found matching your criteria.</p>
                    </div>
                  ) : (
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
                                  {service.logo ? (
                                    <img 
                                      src={service.logo} 
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
                              {getCategoryLabel(service.category as string)}
                            </td>
                            <td className="p-4 align-middle">
                              {getStatusBadge(service.status as ServiceStatus)}
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
                                  <DropdownMenuItem onClick={() => handleToggleStatus(service)}>
                                    {service.status === "ACTIVE" ? (
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
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(service)}>
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
                                  <DropdownMenuItem 
                                    className="text-red-600" 
                                    onClick={() => confirmDeleteService(service.id)}
                                  >
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
                  )}
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
                        onChange={(e) => handleServiceInputChange("name", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={currentService.category}
                        onValueChange={(value) => handleServiceInputChange("category", value as 'STREAMING' | 'GAMING' | 'PRODUCTIVITY' | 'EDUCATION' | 'MUSIC' | 'FITNESS' | 'OTHER')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STREAMING">Streaming</SelectItem>
                          <SelectItem value="GAMING">Gaming</SelectItem>
                          <SelectItem value="PRODUCTIVITY">Productivity</SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="MUSIC">Music</SelectItem>
                          <SelectItem value="FITNESS">Fitness</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={currentService.status}
                        onValueChange={(value) => handleServiceInputChange("status", value as 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REVIEW')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="REVIEW">Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="logo"
                          placeholder="/logos/service.svg"
                          value={currentService.logo}
                          onChange={(e) => handleServiceInputChange("logo", e.target.value)}
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
                        onChange={(e) => handleServiceInputChange("description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        placeholder="e.g. https://www.netflix.com"
                        value={currentService.website}
                        onChange={(e) => handleServiceInputChange("website", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="termsUrl">Terms URL</Label>
                      <Input
                        id="termsUrl"
                        placeholder="e.g. https://www.netflix.com/terms"
                        value={currentService.termsUrl}
                        onChange={(e) => handleServiceInputChange("termsUrl", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="privacyUrl">Privacy URL</Label>
                      <Input
                        id="privacyUrl"
                        placeholder="e.g. https://www.netflix.com/privacy"
                        value={currentService.privacyUrl}
                        onChange={(e) => handleServiceInputChange("privacyUrl", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="supportUrl">Support URL</Label>
                      <Input
                        id="supportUrl"
                        placeholder="e.g. https://www.netflix.com/support"
                        value={currentService.supportUrl}
                        onChange={(e) => handleServiceInputChange("supportUrl", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="maxMembers">Max Members</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        min="0"
                        value={currentService.maxMembers}
                        onChange={(e) => handleServiceInputChange("maxMembers", parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="featured" 
                        checked={currentService.featured}
                        onCheckedChange={(value) => handleServiceInputChange("featured", value)}
                      />
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
                              {plan.maxMembers} members | ${plan.price}/{plan.cycle === "MONTHLY" ? "mo" : "yr"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditPlan(plan)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => confirmDeletePlan(currentService.id, plan.id)}
                            >
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
                <Button onClick={handleSaveService} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
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
                      onChange={(e) => handlePlanInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Max Members</Label>
                    <Input
                      id="maxMembers"
                      type="number"
                      min="1"
                      value={currentPlan.maxUsers}
                      onChange={(e) => handlePlanInputChange("maxUsers", parseInt(e.target.value))}
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
                      onChange={(e) => handlePlanInputChange("price", parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Billing Cycle</Label>
                    <Select 
                      value={currentPlan.recurrence}
                      onValueChange={(value) => handlePlanInputChange("recurrence", value as "monthly" | "yearly")}
                    >
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
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center p-2">
                      <Input 
                        placeholder="Add a feature..." 
                        className="border-0 shadow-none"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button size="sm" variant="ghost" onClick={handleAddFeature}>
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
                <Button onClick={handleSavePlan} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {planToDelete ? "Delete Plan" : "Delete Service"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {planToDelete 
                  ? "Are you sure you want to delete this plan? This action cannot be undone."
                  : "Are you sure you want to delete this service? All associated plans will also be deleted. This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={planToDelete ? handleDeletePlan : handleDeleteService}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {planToDelete ? "Delete Plan" : "Delete Service"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}