import React from "react";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {  
  ArrowLeft,
  Trash,
  Plus,
  Save,
  Info,
  CreditCard,
  KeyRound,
  Edit,
  DollarSign
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useEffect } from "react";
import { useState } from "react";

type ServiceCategory = "entertainment" | "productivity" | "education" | "utility";
type ServiceStatus = "active" | "inactive" | "maintenance";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  seats: number;
  discount?: number;
}

interface AccessField {
  id: string;
  name: string;
  description: string;
  required: boolean;
  type: "text" | "email" | "password" | "url" | "number";
  placeholder?: string;
}

interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  logo?: string;
  description: string;
  status: ServiceStatus;
  website: string;
  maxSeats: number;
  subscriptionPlans: SubscriptionPlan[];
  accessFields: AccessField[];
  usersCount?: number;
}

// Sample service data for a new service
const newService: Service = {
  id: "",
  name: "",
  category: "entertainment",
  description: "",
  status: "inactive",
  website: "",
  maxSeats: 1,
  subscriptionPlans: [],
  accessFields: []
};

// Sample services data (for edit mode)
const sampleServices: Service[] = [
  {
    id: "1",
    name: "Netflix",
    category: "entertainment",
    description: "Streaming service for movies and TV shows",
    status: "active",
    website: "https://netflix.com",
    maxSeats: 5,
    usersCount: 1256,
    subscriptionPlans: [
      {
        id: "np1",
        name: "Basic",
        price: 9.99,
        billingCycle: "monthly",
        features: ["Standard Definition", "1 Screen", "No Downloads"],
        seats: 1
      },
      {
        id: "np2",
        name: "Standard",
        price: 15.49,
        billingCycle: "monthly",
        features: ["High Definition", "2 Screens", "Downloads on 2 devices"],
        seats: 2
      },
      {
        id: "np3",
        name: "Premium",
        price: 19.99,
        billingCycle: "monthly",
        features: ["Ultra HD", "4 Screens", "Downloads on 6 devices"],
        seats: 4,
        discount: 15
      }
    ],
    accessFields: [
      {
        id: "nf1",
        name: "Email",
        description: "Netflix account email",
        required: true,
        type: "email",
        placeholder: "name@example.com"
      },
      {
        id: "nf2",
        name: "Password",
        description: "Account password",
        required: true,
        type: "password"
      },
      {
        id: "nf3",
        name: "Profile Name",
        description: "Name for your profile",
        required: true,
        type: "text",
        placeholder: "Your name or nickname"
      },
      {
        id: "nf4",
        name: "Profile PIN (Optional)",
        description: "PIN for profile access control",
        required: false,
        type: "number",
        placeholder: "4-digit PIN"
      }
    ]
  },
  {
    id: "2",
    name: "Spotify",
    category: "entertainment",
    description: "Music streaming service",
    status: "active",
    website: "https://spotify.com",
    maxSeats: 6,
    usersCount: 985,
    subscriptionPlans: [
      {
        id: "sp1",
        name: "Individual",
        price: 9.99,
        billingCycle: "monthly",
        features: ["Ad-free music", "Offline playback", "On-demand playback"],
        seats: 1
      },
      {
        id: "sp2",
        name: "Duo",
        price: 12.99,
        billingCycle: "monthly",
        features: ["2 Premium accounts", "Ad-free music", "Offline playback"],
        seats: 2
      },
      {
        id: "sp3",
        name: "Family",
        price: 15.99,
        billingCycle: "monthly",
        features: ["6 Premium accounts", "Ad-free music", "Block explicit music"],
        seats: 6,
        discount: 20
      }
    ],
    accessFields: [
      {
        id: "sf1",
        name: "Email",
        description: "Spotify account email",
        required: true,
        type: "email",
        placeholder: "name@example.com"
      },
      {
        id: "sf2",
        name: "Password",
        description: "Account password",
        required: true,
        type: "password"
      },
      {
        id: "sf3",
        name: "Display Name",
        description: "Your name in Spotify",
        required: true,
        type: "text",
        placeholder: "Your name"
      }
    ]
  }
];

export default function ServiceDetails() {
      const params = useParams();
    const navigate = useNavigate();
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

  // Fetch the service data based on ID (for edit mode)
  useEffect(() => {
    if (!isNewService && serviceId) {
      const foundService = sampleServices.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        console.error("Service not found");
        // Redirect to service management page if service not found
        navigate("/admin/services");
      }
    }
  }, [isNewService, serviceId, navigate]);

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
      id: `plan_${Date.now()}`,
      name: "",
      price: 0,
      billingCycle: "monthly",
      features: [],
      seats: 1
    };
    
    setEditingPlan(newPlan);
    setEditingPlanIndex(null);
  };

  const handleEditPlan = (plan: SubscriptionPlan, index: number) => {
    setEditingPlan({...plan});
    setEditingPlanIndex(index);
  };

  const handleDeletePlan = (index: number) => {
    setService(prev => ({
      ...prev,
      subscriptionPlans: prev.subscriptionPlans.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setService(prev => {
        const newPlans = [...prev.subscriptionPlans];
        
        if (editingPlanIndex !== null) {
          // Update existing plan
          newPlans[editingPlanIndex] = editingPlan;
        } else {
          // Add new plan
          newPlans.push(editingPlan);
        }
        
        return {
          ...prev,
          subscriptionPlans: newPlans
        };
      });
      
      setEditingPlan(null);
      setEditingPlanIndex(null);
      setIsDirty(true);
    }
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
      id: `field_${Date.now()}`,
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
      accessFields: prev.accessFields.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSaveField = () => {
    if (editingField) {
      setService(prev => {
        const newFields = [...prev.accessFields];
        
        if (editingFieldIndex !== null) {
          // Update existing field
          newFields[editingFieldIndex] = editingField;
        } else {
          // Add new field
          newFields.push(editingField);
        }
        
        return {
          ...prev,
          accessFields: newFields
        };
      });
      
      setEditingField(null);
      setEditingFieldIndex(null);
      setIsDirty(true);
    }
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
  const handleSaveService = () => {
    // In a real app, this would save the service data via API
    console.log("Saving service:", service);
    
    // Redirect to service management page
    navigate("/admin/services");
  };

  const handleDeleteService = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    // In a real app, this would delete the service via API
    console.log("Deleting service:", service.name);
    
    setDeleteDialogOpen(false);
    // Redirect to service management page
    navigate("/admin/services");
  };

  return (
    <DashboardLayout userRole="admin">
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
                      onValueChange={(value) => handleServiceChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
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
                      onValueChange={(value) => handleServiceChange("status", value as ServiceStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxSeats">Maximum Seats</Label>
                    <Input 
                      id="maxSeats" 
                      type="number" 
                      min="1"
                      value={service.maxSeats} 
                      onChange={(e) => handleServiceChange("maxSeats", parseInt(e.target.value))} 
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
              </CardContent>
            </Card>
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
                {service.subscriptionPlans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No subscription plans defined. Click "Add Plan" to create your first plan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {service.subscriptionPlans.map((plan, index) => (
                      <Card key={plan.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{plan.name}</CardTitle>
                              <div className="flex mt-1 items-center gap-2">
                                <Badge>
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {plan.price.toFixed(2)} / {plan.billingCycle}
                                </Badge>
                                <Badge variant="outline">
                                  {plan.seats} {plan.seats === 1 ? "seat" : "seats"}
                                </Badge>
                                {plan.discount && (
                                  <Badge variant="secondary">
                                    {plan.discount}% discount
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
                        <CardContent className="pb-3 pt-0">
                          <div className="text-sm">
                            <div className="font-medium mb-1">Features:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {plan.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Plan Edit Dialog */}
            {editingPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPlanIndex !== null ? "Edit Plan" : "Add New Plan"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planName">Plan Name</Label>
                      <Input 
                        id="planName" 
                        value={editingPlan.name} 
                        onChange={(e) => handlePlanChange("name", e.target.value)} 
                        placeholder="e.g. Basic, Premium, Family"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="price" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          className="pl-8"
                          value={editingPlan.price} 
                          onChange={(e) => handlePlanChange("price", parseFloat(e.target.value))} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingCycle">Billing Cycle</Label>
                      <Select 
                        value={editingPlan.billingCycle} 
                        onValueChange={(value) => handlePlanChange("billingCycle", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input 
                        id="seats" 
                        type="number" 
                        min="1"
                        value={editingPlan.seats} 
                        onChange={(e) => handlePlanChange("seats", parseInt(e.target.value))} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount % (Optional)</Label>
                      <Input 
                        id="discount" 
                        type="number" 
                        min="0"
                        max="100"
                        value={editingPlan.discount || ""} 
                        onChange={(e) => handlePlanChange("discount", e.target.value ? parseInt(e.target.value) : undefined)} 
                        placeholder="e.g. 15"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <ul className="border rounded-md p-2 min-h-[100px] mb-2">
                      {editingPlan.features.length === 0 ? (
                        <li className="text-center py-4 text-muted-foreground">
                          No features added yet
                        </li>
                      ) : (
                        editingPlan.features.map((feature, index) => (
                          <li key={index} className="flex justify-between items-center py-1 px-2 hover:bg-muted rounded-md">
                            <span>{feature}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(index)}>
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </li>
                        ))
                      )}
                    </ul>
                    
                    <div className="flex gap-2">
                      <Input 
                        value={newFeature} 
                        onChange={(e) => setNewFeature(e.target.value)} 
                        placeholder="Add a feature..."
                        onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                      />
                      <Button onClick={handleAddFeature}>Add</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingPlan(null);
                        setEditingPlanIndex(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSavePlan}>
                      Save Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Access Info Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Access Information</CardTitle>
                  <CardDescription>
                    Define the information needed for users to access this service
                  </CardDescription>
                </div>
                <Button onClick={handleAddField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                {service.accessFields && service.accessFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No access fields defined. Click "Add Field" to specify what information users need to access this service.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {service.accessFields && service.accessFields.map((field, index) => (
                      <Card key={field.id} className="overflow-hidden">
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
              </CardContent>
            </Card>
            
            {/* Field Edit Dialog */}
            {editingField && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingFieldIndex !== null ? "Edit Field" : "Add New Field"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fieldName">Field Name</Label>
                      <Input 
                        id="fieldName" 
                        value={editingField.name} 
                        onChange={(e) => handleFieldChange("name", e.target.value)} 
                        placeholder="e.g. Email, Password, Username"
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
                      <input
                        type="checkbox"
                        id="fieldRequired"
                        checked={editingField.required}
                        onChange={(e) => handleFieldChange("required", e.target.checked)}
                        className="form-checkbox h-4 w-4"
                      />
                      <Label htmlFor="fieldRequired" className="cursor-pointer">Required Field</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingField(null);
                        setEditingFieldIndex(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveField}>
                      Save Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <Button 
            variant="destructive" 
            onClick={handleDeleteService}
            disabled={isNewService}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Service
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/services")}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveService}
              disabled={!service.name || !service.website}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Service
            </Button>
          </div>
        </div>
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