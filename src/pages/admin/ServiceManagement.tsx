import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Search,
  MoreHorizontal, 
  Plus,
  Edit,
  Trash,
  Eye,
  RefreshCw,
  Filter,
  Info
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

type ServiceCategory = "entertainment" | "productivity" | "education" | "utility";
type ServiceStatus = "active" | "inactive" | "maintenance";

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
  usersCount: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  seats: number;
  discount?: number;
}

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
    ]
  },
  {
    id: "3",
    name: "Microsoft 365",
    category: "productivity",
    description: "Productivity suite including Word, Excel, PowerPoint and more",
    status: "active",
    website: "https://microsoft.com/microsoft-365",
    maxSeats: 6,
    usersCount: 754,
    subscriptionPlans: [
      {
        id: "ms1",
        name: "Personal",
        price: 6.99,
        billingCycle: "monthly",
        features: ["1 Person", "Word, Excel, PowerPoint", "1TB OneDrive storage"],
        seats: 1,
      },
      {
        id: "ms2",
        name: "Family",
        price: 9.99,
        billingCycle: "monthly",
        features: ["Up to 6 people", "Word, Excel, PowerPoint", "6TB OneDrive storage"],
        seats: 6,
        discount: 20
      },
      {
        id: "ms3",
        name: "Family Annual",
        price: 99.99,
        billingCycle: "yearly",
        features: ["Up to 6 people", "Word, Excel, PowerPoint", "6TB OneDrive storage"],
        seats: 6,
        discount: 30
      }
    ]
  },
  {
    id: "4",
    name: "Disney+",
    category: "entertainment",
    description: "Streaming service for Disney, Pixar, Marvel, Star Wars and National Geographic",
    status: "active",
    website: "https://disneyplus.com",
    maxSeats: 4,
    usersCount: 867,
    subscriptionPlans: [
      {
        id: "dp1",
        name: "Standard",
        price: 7.99,
        billingCycle: "monthly",
        features: ["HD streaming", "2 screens at once", "7 profiles"],
        seats: 4
      },
      {
        id: "dp2",
        name: "Premium",
        price: 10.99,
        billingCycle: "monthly",
        features: ["4K UHD streaming", "4 screens at once", "Dolby Atmos audio"],
        seats: 4,
        discount: 10
      },
      {
        id: "dp3",
        name: "Annual",
        price: 79.99,
        billingCycle: "yearly",
        features: ["HD streaming", "2 screens at once", "7 profiles"],
        seats: 4,
        discount: 15
      }
    ]
  },
  {
    id: "5",
    name: "Adobe Creative Cloud",
    category: "productivity",
    description: "Suite of creative apps including Photoshop, Illustrator, and more",
    status: "maintenance",
    website: "https://adobe.com",
    maxSeats: 2,
    usersCount: 345,
    subscriptionPlans: [
      {
        id: "acc1",
        name: "Photography Plan",
        price: 9.99,
        billingCycle: "monthly",
        features: ["Photoshop", "Lightroom", "20GB Cloud Storage"],
        seats: 1
      },
      {
        id: "acc2",
        name: "Single App",
        price: 20.99,
        billingCycle: "monthly",
        features: ["Choose one Adobe app", "100GB Cloud Storage", "Adobe Fonts"],
        seats: 1
      },
      {
        id: "acc3",
        name: "All Apps",
        price: 52.99,
        billingCycle: "monthly",
        features: ["All creative apps", "100GB Cloud Storage", "Adobe Fonts"],
        seats: 1,
        discount: 25
      }
    ]
  }
];

export default function ServiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Filter and search services
  const filteredServices = sampleServices.filter(service => {
    // Search by name or description
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    // Filter by status
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle service actions
  const handleEditService = (service: Service) => {
    // Navigate to edit service page with the service ID
    navigate(`/admin/service/${service.id}`);
  };

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      // In a real app, this would call an API to delete the service
      console.log("Deleting service:", serviceToDelete.name);
    }
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const renderStatusBadge = (status: ServiceStatus) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return null;
    }
  };

  const renderCategoryBadge = (category: ServiceCategory) => {
    switch(category) {
      case "entertainment":
        return <Badge className="bg-purple-500">Entertainment</Badge>;
      case "productivity":
        return <Badge className="bg-blue-500">Productivity</Badge>;
      case "education":
        return <Badge className="bg-amber-500">Education</Badge>;
      case "utility":
        return <Badge className="bg-cyan-500">Utility</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-4 p-4 md:p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Service Management</h1>
            <p className="text-muted-foreground">
              Manage available services and subscription plans
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <NavLink to="/admin/service/new">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </NavLink>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          <div className="relative flex-1 md:max-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 md:ml-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Desktop table view */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plans</TableHead>
                    <TableHead>Max Seats</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No services found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {service.description}
                          </div>
                        </TableCell>
                        <TableCell>{renderCategoryBadge(service.category)}</TableCell>
                        <TableCell>{renderStatusBadge(service.status)}</TableCell>
                        <TableCell>{service.subscriptionPlans.length}</TableCell>
                        <TableCell>{service.maxSeats}</TableCell>
                        <TableCell>{service.usersCount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditService(service)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit service
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteService(service)}
                                className="text-destructive"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile view */}
        <div className="md:hidden">
          {paginatedServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No services found matching your search criteria
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditService(service)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit service
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service)}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {renderCategoryBadge(service.category)}
                      {renderStatusBadge(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Plans</div>
                        <div>{service.subscriptionPlans.length}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Max Seats</div>
                        <div>{service.maxSeats}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Users</div>
                        <div>{service.usersCount.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 py-3 bg-muted/50 flex justify-end border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center mx-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              {serviceToDelete && ` "${serviceToDelete.name}"`} and all its related data.
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