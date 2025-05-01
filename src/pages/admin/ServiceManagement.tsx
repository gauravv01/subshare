import React, { useState, useEffect } from "react";
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
  Loader2,
  Settings
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
import { useServices } from "../../context/ServiceProvider";
import { useToast } from "../../hooks/use-toast";

export default function ServiceManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    services, 
    fetchServices, 
    deleteService, 
    updateServiceStatus,
    isLoading 
  } = useServices();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        await fetchServices();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadServices();
  }, []);

  // Filter and search services
  const filteredServices = services.filter(service => {
    // Search by name or description
    if (searchTerm && 
        !service.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && service.category !== selectedCategory) {
      return false;
    }
    
    // Filter by status
    if (selectedStatus && service.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle service actions
  const handleEditService = (serviceId: string) => {
    navigate(`/admin/service/${serviceId}`);
  };

  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setIsSubmitting(true);
    try {
      await deleteService(serviceToDelete);
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleToggleStatus = async (serviceId: string, currentStatus: string) => {
    setIsSubmitting(true);
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateServiceStatus(serviceId, newStatus);
      toast({
        title: "Status updated",
        description: `Service is now ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "INACTIVE":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
      case "REVIEW":
        return <Badge variant="secondary" className="bg-orange-500">Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderCategoryBadge = (category: string) => {
    switch(category) {
      case "STREAMING":
        return <Badge className="bg-purple-500">Streaming</Badge>;
      case "GAMING":
        return <Badge className="bg-red-500">Gaming</Badge>;
      case "PRODUCTIVITY":
        return <Badge className="bg-blue-500">Productivity</Badge>;
      case "EDUCATION":
        return <Badge className="bg-amber-500">Education</Badge>;
      case "MUSIC":
        return <Badge className="bg-yellow-500">Music</Badge>;
      case "FITNESS":
        return <Badge className="bg-green-500">Fitness</Badge>;
      case "OTHER":
        return <Badge className="bg-gray-500">Other</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
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
                    <TableHead>Max Members</TableHead>
                    <TableHead>Featured</TableHead>
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
                              <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                {service.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{renderCategoryBadge(service.category)}</TableCell>
                        <TableCell>{renderStatusBadge(service.status)}</TableCell>
                        <TableCell>{service.plans.length}</TableCell>
                        <TableCell>{service.maxMembers || 0}</TableCell>
                        <TableCell>{service.featured ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditService(service.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit service
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(service.id, service.status)}
                              >
                                {service.status === "ACTIVE" ? (
                                  <>
                                    <Badge variant="outline" className="mr-2">Deactivate</Badge>
                                  </>
                                ) : (
                                  <>
                                    <Badge className="mr-2">Activate</Badge>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteService(service.id)}
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
                          <DropdownMenuItem onClick={() => handleEditService(service.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit service
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(service.id, service.status)}
                          >
                            {service.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteService(service.id)}
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
                        <div>{service.plans.length}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Max Members</div>
                        <div>{service.maxMembers || 0}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Featured</div>
                        <div>{service.featured ? "Yes" : "No"}</div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 py-3 bg-muted/50 flex justify-end border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditService(service.id)}
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
              and all its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteService} 
              className="bg-destructive text-destructive-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}