import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  MoreHorizontal, 
  User,
  Ban,
  CheckCircle,
  Filter,
  Eye,
  Edit,
  UserCog
} from "lucide-react";
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type UserStatus = "active" | "inactive" | "banned" | "pending";
type UserRole = "account-holder" | "co-subscriber" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  joinDate: string;
  subscriptions?: number;
  members?: number;
}

// Sample user data
const users: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "account-holder",
    status: "active",
    country: "United States",
    joinDate: "2024-10-15",
    subscriptions: 3,
    members: 12
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    role: "co-subscriber",
    status: "active",
    country: "Canada",
    joinDate: "2024-11-05"
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    role: "admin",
    status: "active",
    country: "United Kingdom",
    joinDate: "2024-09-20"
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    role: "account-holder",
    status: "active",
    country: "Australia",
    joinDate: "2024-12-01",
    subscriptions: 1,
    members: 3
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "co-subscriber",
    status: "banned",
    country: "South Korea",
    joinDate: "2024-10-10"
  },
  {
    id: "6",
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    role: "account-holder",
    status: "inactive",
    country: "Singapore",
    joinDate: "2024-11-15",
    subscriptions: 2,
    members: 7
  },
  {
    id: "7",
    name: "James Wilson",
    email: "j.wilson@example.com",
    role: "co-subscriber",
    status: "active",
    country: "Germany",
    joinDate: "2024-12-05"
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "m.garcia@example.com",
    role: "account-holder",
    status: "pending",
    country: "Spain",
    joinDate: "2024-12-10",
    subscriptions: 0,
    members: 0
  }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Search by name, email, or country
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    console.log("Action: view for user:", user.name);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserDialog(true);
    console.log("Action: edit for user:", user.name);
  };

  const handleBanUser = (user: User) => {
    // In a real app, this would call an API to update the user status
    console.log("Action: ban for user:", user.name);
  };

  const handleUnbanUser = (user: User) => {
    // In a real app, this would call an API to update the user status
    console.log("Action: unban for user:", user.name);
  };

  const renderStatusBadge = (status: UserStatus) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return null;
    }
  };

  const renderRoleBadge = (role: UserRole) => {
    switch(role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "account-holder":
        return <Badge className="bg-blue-500">Account Holder</Badge>;
      case "co-subscriber":
        return <Badge className="bg-cyan-500">Co-Subscriber</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
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
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="account-holder">Account Holder</SelectItem>
                  <SelectItem value="co-subscriber">Co-Subscriber</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{renderRoleBadge(user.role)}</TableCell>
                        <TableCell>{renderStatusBadge(user.status)}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
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
                              {user.status === "banned" ? (
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
                        <div className="font-medium">{user.name}</div>
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
                        {user.status === "banned" ? (
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
                      <div>{user.country}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Join Date</div>
                      <div>{new Date(user.joinDate).toLocaleDateString()}</div>
                    </div>
                    {user.role === "account-holder" && (
                      <>
                        <div>
                          <div className="text-muted-foreground">Subscriptions</div>
                          <div>{user.subscriptions}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Members</div>
                          <div>{user.members}</div>
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
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
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
                  <p>{selectedUser.country}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Join Date</h4>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                {selectedUser.role === "account-holder" && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Subscriptions</h4>
                      <p>{selectedUser.subscriptions}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Members</h4>
                      <p>{selectedUser.members}</p>
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
            <form className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={selectedUser.name} />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={selectedUser.email} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="account-holder">Account Holder</SelectItem>
                        <SelectItem value="co-subscriber">Co-Subscriber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={selectedUser.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue={selectedUser.country} />
                </div>
              </div>
          
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditUserDialog(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}