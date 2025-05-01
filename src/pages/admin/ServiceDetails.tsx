import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { 
  ArrowLeft, 
  Info, 
  CreditCard, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash,
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
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
import { useServices } from "../../context/ServiceProvider";

// Types
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  seats: number;
}

interface AccessField {
  id: string;
  name: string;
  description: string;
  required: boolean;
  type: string;
  placeholder?: string;
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
  accessFields?: AccessField[];
}

// Create a new empty service template
const newService: Service = {
  id: "",
  name: "",
  description: "",
  website: "",
  logo: "",
  category: "OTHER",
  maxMembers: 6,
  termsUrl: "",
  privacyUrl: "",
  supportUrl: "",
  features: [],
  allowedCountries: [],
  status: "INACTIVE",
  featured: false,
  plans: [],
  accessFields: []
};

// Add this function to validate URLs
const isValidUrl = (url: string) => {
  if (!url || url.trim() === '') return true; // Empty is OK
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default function ServiceDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    fetchService, 
    addService, 
    updateService, 
    deleteService, 
    addServicePlan, 
    updateServicePlan, 
    deleteServicePlan,
    addAccessField,
    updateAccessField, 
    deleteAccessField,
    getAccessFields,
    isLoading 
  } = useServices();
  
  const isNewService = params.id === "new";
  const serviceId = isNewService ? "" : params.id || "";
  
  const [activeTab, setActiveTab] = useState("details");
  const [service, setService] = useState<Service>(newService);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<AccessField | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the service data based on ID (for edit mode)
  useEffect(() => {
    const loadService = async () => {
      if (!isNewService && serviceId) {
        try {
          const serviceData = await fetchService(serviceId);
          
          // Initialize accessFields if it's undefined
          setService({
            ...serviceData,
            accessFields: serviceData.accessFields || []
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load service details. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadService();
  }, [isNewService, serviceId]);

  // Handle service form changes
  const handleServiceChange = (field: keyof Service, value: any) => {
    setService(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  // Handle plan operations
  const handleAddPlan = () => {
    const newPlan: SubscriptionPlan = {
      id: "",
      name: "",
      price: 0,
      billingCycle: "MONTHLY",
      features: [],
      seats: 1
    };
    
    setEditingPlan(newPlan);
    setEditingPlanIndex(null);
  };

  const handleEditPlan = (plan: any, index: number) => {
    setEditingPlan({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.cycle,
      features: plan.features || [],
      seats: plan.maxMembers
    });
    setEditingPlanIndex(index);
  };

  const handleDeletePlan = async (index: number) => {
    if (isNewService) {
      // For new services, just update the local state
      setService(prev => ({
        ...prev,
        plans: prev.plans.filter((_, i) => i !== index)
      }));
      setIsDirty(true);
    } else {
      // For existing services, call the API
      const planId = service.plans[index].id;
      setIsSubmitting(true);
      
      try {
        await deleteServicePlan(service.id, planId);
        
        setService(prev => ({
          ...prev,
          plans: prev.plans.filter((_, i) => i !== index)
        }));
        
        toast({
          title: "Plan deleted",
          description: "The plan has been deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    
    // Convert component plan format to API format
    const apiPlan = {
      id: editingPlan.id,
      name: editingPlan.name,
      price: editingPlan.price,
      cycle: editingPlan.billingCycle,
      features: editingPlan.features,
      maxMembers: editingPlan.seats
    };
    
    if (isNewService) {
      // For new services, just update the local state
      setService(prev => {
        const newPlans = [...prev.plans];
        
        if (editingPlanIndex !== null) {
          // Update existing plan
          newPlans[editingPlanIndex] = apiPlan;
        } else {
          // Add new plan
          newPlans.push(apiPlan);
        }
        
        return {
          ...prev,
          plans: newPlans
        };
      });
    } else {
      // For existing services, call the API
      setIsSubmitting(true);
      
      try {
        if (editingPlan.id) {
          // Update existing plan
          await updateServicePlan(service.id, editingPlan.id, apiPlan);
        } else {
          // Add new plan
          await addServicePlan(service.id, apiPlan);
        }
        
        // Refresh service data
        const updatedService = await fetchService(service.id);
        setService(updatedService);
        
        toast({
          title: editingPlan.id ? "Plan updated" : "Plan added",
          description: `The plan has been ${editingPlan.id ? "updated" : "added"} successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to ${editingPlan.id ? "update" : "add"} plan. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
    
    setEditingPlan(null);
    setEditingPlanIndex(null);
    setIsDirty(true);
  };

  const handlePlanChange = (field: keyof SubscriptionPlan, value: any) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        [field]: value
      });
    }
  };

  const handleAddFeature = () => {
    if (editingPlan && newFeature.trim()) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index)
      });
    }
  };

  // Handle access fields operations
  const handleAddField = () => {
    const newField: AccessField = {
      id: "",
      name: "",
      description: "",
      required: true,
      type: "text"
    };
    
    setEditingField(newField);
    setEditingFieldIndex(null);
  };

  const handleEditField = (field: AccessField, index: number) => {
    setEditingField({...field});
    setEditingFieldIndex(index);
  };

  const handleDeleteField = (index: number) => {
    setService(prev => ({
      ...prev,
      accessFields: prev.accessFields?.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSaveField = async () => {
    if (!editingField) return;
    
    // Convert field type to uppercase for API
    const apiField = {
      ...editingField,
      type: editingField.type.toUpperCase()
    };
    
    if (isNewService) {
      // For new services, just update the local state
      setService(prev => {
        const newFields = [...(prev.accessFields || [])];
        
        if (editingFieldIndex !== null) {
          // Update existing field
          newFields[editingFieldIndex] = apiField;
        } else {
          // Add new field
          newFields.push(apiField);
        }
        
        return {
          ...prev,
          accessFields: newFields
        };
      });
    } else {
      // For existing services, call the API
      setIsSubmitting(true);
      
      try {
        if (editingField.id) {
          // Update existing field
          await updateAccessField(service.id, editingField.id, apiField);
        } else {
          // Add new field
          await addAccessField(service.id, apiField);
        }
        
        // Refresh service data
        const updatedService = await fetchService(service.id);
        setService({
          ...updatedService,
          accessFields: updatedService.accessFields || []
        });
        
        toast({
          title: editingField.id ? "Field updated" : "Field added",
          description: `The field has been ${editingField.id ? "updated" : "added"} successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to ${editingField.id ? "update" : "add"} field. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
    
    setEditingField(null);
    setEditingFieldIndex(null);
    setIsDirty(true);
  };

  const handleFieldChange = (field: keyof AccessField, value: any) => {
    if (editingField) {
      setEditingField({
        ...editingField,
        [field]: value
      });
    }
  };

  // Handle the overall service save
  const handleSaveService = async () => {
    // Validate URLs
    if (service.website && !isValidUrl(service.website)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL or leave it empty",
        variant: "destructive",
      });
      return;
    }
    
    // Similar validation for other URL fields
    
    setIsSubmitting(true);
    
    try {
      if (isNewService) {
        await addService(service);
        toast({
          title: "Service created",
          description: "The service has been created successfully",
        });
      } else {
        await updateService(service);
        toast({
          title: "Service updated",
          description: "The service has been updated successfully",
        });
      }
      
      navigate("/admin/services");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isNewService ? "create" : "update"} service. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    setIsSubmitting(true);
    
    try {
      await deleteService(service.id);
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully",
      });
      
      setDeleteDialogOpen(false);
      navigate("/admin/services");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !isNewService) {
    return (
        <DashboardLayout >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading service details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout >
      <div className="space-y-4 p-4 md:p-0">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate("/admin/services")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNewService ? "Create New Service" : `Edit Service: ${service.name}`}
            </h1>
            <p className="text-muted-foreground">
              {isNewService 
                ? "Add a new service to the platform" 
                : "Update service details, plans, and access information"
              }
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Service Details
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription Plans
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center">
              <KeyRound className="h-4 w-4 mr-2" />
              Access Info
            </TabsTrigger>
          </TabsList>
          
          {/* Service Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  General information about the service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input 
                      id="name" 
                      value={service.name} 
                      onChange={(e) => handleServiceChange("name", e.target.value)} 
                      placeholder="e.g. Netflix"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={service.category} 
                      onValueChange={(value) => handleServiceChange("category", value as Service['category'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
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
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={service.website} 
                      onChange={(e) => handleServiceChange("website", e.target.value)} 
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={service.status} 
                      onValueChange={(value) => handleServiceChange("status", value as Service['status'])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Input 
                      id="maxMembers" 
                      type="number" 
                      min="1"
                      value={service.maxMembers || 1} 
                      onChange={(e) => handleServiceChange("maxMembers", parseInt(e.target.value))} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input 
                      id="logo" 
                      value={service.logo} 
                      onChange={(e) => handleServiceChange("logo", e.target.value)} 
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={service.description} 
                    onChange={(e) => handleServiceChange("description", e.target.value)} 
                    placeholder="Describe the service..."
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={service.featured}
                    onCheckedChange={(value) => handleServiceChange("featured", value)}
                  />
                  <Label htmlFor="featured">Feature this service on the homepage</Label>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/admin/services")}>
                Cancel
              </Button>
              <div className="space-x-2">
                {!isNewService && (
                  <Button variant="destructive" onClick={handleDeleteService}>
                    Delete Service
                  </Button>
                )}
                <Button onClick={handleSaveService} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isNewService ? "Create Service" : "Save Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Subscription Plans Tab */}
          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Subscription Plans</CardTitle>
                  <CardDescription>
                    Define available subscription plans and pricing
                  </CardDescription>
                </div>
                <Button onClick={handleAddPlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </CardHeader>
              <CardContent>
                {service.plans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No subscription plans defined yet.</p>
                    <Button variant="outline" onClick={handleAddPlan}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Plan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {service.plans.map((plan, index) => (
                      <Card key={plan.id || index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{plan.name}</CardTitle>
                              <CardDescription>
                                ${plan.price}/{plan.cycle === "MONTHLY" ? "month" : "year"} • {plan.maxMembers} members
                              </CardDescription>
                              <div className="flex mt-1 flex-wrap gap-1">
                                {plan.features.slice(0, 3).map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="font-normal">
                                    {feature}
                                  </Badge>
                                ))}
                                {plan.features.length > 3 && (
                                  <Badge variant="secondary" className="font-normal">
                                    +{plan.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan, index)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(index)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Plan Edit Dialog */}
                {editingPlan && (
                  <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingPlanIndex !== null ? "Edit Plan" : "Add New Plan"}
                        </DialogTitle>
                        <DialogDescription>
                          Configure subscription plan details
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="planName">Plan Name</Label>
                            <Input 
                              id="planName" 
                              value={editingPlan.name} 
                              onChange={(e) => handlePlanChange("name", e.target.value)} 
                              placeholder="e.g. Basic, Premium"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="planPrice">Price</Label>
                            <Input 
                              id="planPrice" 
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingPlan.price} 
                              onChange={(e) => handlePlanChange("price", parseFloat(e.target.value))} 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="planCycle">Billing Cycle</Label>
                            <Select 
                              value={editingPlan.billingCycle} 
                              onValueChange={(value) => handlePlanChange("billingCycle", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select billing cycle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="planSeats">Number of Seats</Label>
                            <Input 
                              id="planSeats" 
                              type="number"
                              min="1"
                              value={editingPlan.seats} 
                              onChange={(e) => handlePlanChange("seats", parseInt(e.target.value))} 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Features</Label>
                          <div className="border rounded-md p-4">
                            <div className="space-y-2">
                              {editingPlan.features.map((feature, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span>{feature}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveFeature(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center mt-4">
                              <Input 
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add a feature..."
                                className="flex-1 mr-2"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleAddFeature}
                                disabled={!newFeature.trim()}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPlan(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSavePlan} disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Plan
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/admin/services")}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNewService ? "Create Service" : "Save Changes"}
              </Button>
            </div>
          </TabsContent>
          
          {/* Access Info Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Access Fields</CardTitle>
                  <CardDescription>
                    Define what information is needed to access this service
                  </CardDescription>
                </div>
                <Button onClick={handleAddField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                {(!service.accessFields || service.accessFields.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No access fields defined yet.</p>
                    <Button variant="outline" onClick={handleAddField}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Field
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {service.accessFields.map((field, index) => (
                      <Card key={field.id || index} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{field.name}</CardTitle>
                              <CardDescription>
                                {field.description}
                              </CardDescription>
                              <div className="flex mt-1 items-center gap-2">
                                <Badge variant={field.required ? "default" : "outline"}>
                                  {field.required ? "Required" : "Optional"}
                                </Badge>
                                <Badge variant="secondary">
                                  {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditField(field, index)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteField(index)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Field Edit Dialog */}
                {editingField && (
                  <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingFieldIndex !== null ? "Edit Field" : "Add New Field"}
                        </DialogTitle>
                        <DialogDescription>
                          Configure access field details
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fieldName">Field Name</Label>
                            <Input 
                              id="fieldName" 
                              value={editingField.name} 
                              onChange={(e) => handleFieldChange("name", e.target.value)} 
                              placeholder="e.g. Email, Password"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="fieldType">Field Type</Label>
                            <Select 
                              value={editingField.type} 
                              onValueChange={(value) => handleFieldChange("type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="password">Password</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fieldDescription">Description</Label>
                            <Textarea 
                              id="fieldDescription" 
                              value={editingField.description} 
                              onChange={(e) => handleFieldChange("description", e.target.value)} 
                              placeholder="Explain what this field is for..."
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="fieldPlaceholder">Placeholder (Optional)</Label>
                            <Input 
                              id="fieldPlaceholder" 
                              value={editingField.placeholder || ""} 
                              onChange={(e) => handleFieldChange("placeholder", e.target.value || undefined)} 
                              placeholder="e.g. Enter your email"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="fieldRequired"
                              checked={editingField.required}
                              onCheckedChange={(value) => handleFieldChange("required", value)}
                            />
                            <Label htmlFor="fieldRequired">Required Field</Label>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingField(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveField}>
                          Save Field
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/admin/services")}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNewService ? "Create Service" : "Save Changes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              {service.name && ` "${service.name}"`} and all its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteService} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}