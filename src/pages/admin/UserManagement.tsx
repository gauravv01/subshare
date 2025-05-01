import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Search,
  MoreHorizontal, 
  User,
  Ban,
  CheckCircle,
  Eye,
  Edit,
  Loader2
} from "lucide-react";
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../../components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import axiosInstance from "../../lib/axiosInstance";
import { format } from "date-fns";
import { useProfile } from "../../context/ProfileProvider";

// Types
type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING";
type UserRole = "ADMIN" | "UNIFIED";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  country?: string;
  createdAt: string;
  subscriptionCount?: number;
  membershipCount?: number;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string;
  language: string;
  timezone: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  notificationPreferences: any;
  
}

export default function UserManagement() {
  const { toast } = useToast();
  const { profile,updateProfile, updateOtherProfile } = useProfile();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/admin/users');
        setUsers(response.data);
        setTotalUsers(response.data.length);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Search by name, email, or country
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.country?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Filter by role
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    
    // Filter by status
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle user actions
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      // Convert userData to match Profile type
      const profileData: Partial<Profile> = {
        ...userData,
        // Exclude createdAt or convert it to Date if needed
        createdAt: userData.createdAt ? new Date(userData.createdAt) : undefined
      };
      
      await updateOtherProfile(selectedUser.id, profileData);
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));
      
      setSelectedUser({ ...selectedUser, ...userData });
      
      toast({
        title: "User updated",
        description: "User information has been updated successfully",
      });
      
      setEditUserDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBanUser = async (user: User) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/admin/users/${user.id}/status`, { status: "BANNED" });
      
      // Update the user in the local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: "BANNED" as UserStatus } : u
      ));
      
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, status: "BANNED" as UserStatus });
      }
      
      toast({
        title: "User banned",
        description: `${user.name || user.email} has been banned`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnbanUser = async (user: User) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/admin/users/${user.id}/status`, { status: "ACTIVE" });
      
      // Update the user in the local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: "ACTIVE" as UserStatus } : u
      ));
      
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, status: "ACTIVE" as UserStatus });
      }
      
      toast({
        title: "User unbanned",
        description: `${user.name || user.email} has been unbanned`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: UserStatus) => {
    switch(status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "INACTIVE":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "BANNED":
        return <Badge variant="destructive">Banned</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return null;
    }
  };

  const renderRoleBadge = (role: UserRole) => {
    switch(role) {
      case "ADMIN":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "UNIFIED":
        return <Badge className="bg-blue-500">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
        <DashboardLayout >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout >
      <div className="space-y-4 p-4 md:p-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              View and manage users across the platform
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 md:flex-none md:min-w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-auto flex flex-1 gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="UNIFIED">User</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Desktop table view */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name || 'Unnamed User'}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{renderRoleBadge(user.role)}</TableCell>
                        <TableCell>{renderStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.country || 'Unknown'}</TableCell>
                        <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit user
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "BANNED" ? (
                                <DropdownMenuItem onClick={() => handleUnbanUser(user)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Unban user
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleBanUser(user)}
                                  className="text-destructive"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban user
                                </DropdownMenuItem>
                              )}
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
          {paginatedUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No users found matching your search criteria
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {paginatedUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'Unnamed User'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="flex gap-2 mt-1">
                          {renderRoleBadge(user.role)}
                          {renderStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit user
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "BANNED" ? (
                          <DropdownMenuItem onClick={() => handleUnbanUser(user)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unban user
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleBanUser(user)}
                            className="text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban user
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="px-4 pb-4 pt-0 border-t text-sm grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-muted-foreground">Country</div>
                      <div>{user.country || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Join Date</div>
                      <div>{format(new Date(user.createdAt), 'MMM d, yyyy')}</div>
                    </div>
                    {user.role === "UNIFIED" && (
                      <>
                        <div>
                          <div className="text-muted-foreground">Subscriptions</div>
                          <div>{user.subscriptionCount || 0}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Members</div>
                          <div>{user.membershipCount || 0}</div>
                        </div>
                      </>
                    )}
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
      
      {/* View user dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{selectedUser.name || 'Unnamed User'}</h3>
                <div className="flex gap-2 mt-1">
                  {renderRoleBadge(selectedUser.role)}
                  {renderStatusBadge(selectedUser.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Country</h4>
                  <p>{selectedUser.country || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Join Date</h4>
                  <p>{format(new Date(selectedUser.createdAt), 'MMM d, yyyy')}</p>
                </div>
                {selectedUser.role === "UNIFIED" && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Subscriptions</h4>
                      <p>{selectedUser.subscriptionCount || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Members</h4>
                      <p>{selectedUser.membershipCount || 0}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUserDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewUserDialog(false);
              if (selectedUser) handleEditUser(selectedUser);
            }}>
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit user dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const userData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as UserRole,
                status: formData.get('status') as UserStatus,
                country: formData.get('country') as string,

              };
              handleUpdateUser(userData);
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={selectedUser.name || ''} />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={selectedUser.email} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={selectedUser.role} name="role">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="UNIFIED">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={selectedUser.status} name="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="BANNED">Banned</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" defaultValue={selectedUser.country || ''} />
                </div>
              </div>
          
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditUserDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}