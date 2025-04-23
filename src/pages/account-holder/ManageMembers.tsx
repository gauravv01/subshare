import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, UserX, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type Member = {
  id: string;
  name: string;
  email: string;
  subscription: string;
  joinDate: string;
  status: "active" | "pending" | "expired";
  profileAssignment?: string;
};

const membersList: Member[] = [
  {
    id: "1",
    name: "John Kim",
    email: "kim@example.com",
    subscription: "Netflix Premium",
    joinDate: "2025-02-15",
    status: "active",
    profileAssignment: "Profile 2",
  },
  {
    id: "2",
    name: "Sarah Lee",
    email: "lee@example.com",
    subscription: "Netflix Premium",
    joinDate: "2025-02-18",
    status: "active",
    profileAssignment: "Profile 3",
  },
  {
    id: "3",
    name: "Michael Park",
    email: "park@example.com",
    subscription: "Netflix Premium",
    joinDate: "2025-03-01",
    status: "active",
    profileAssignment: "Profile 4",
  },
  {
    id: "4",
    name: "Emma Jung",
    email: "jung@example.com",
    subscription: "Disney+ Standard",
    joinDate: "2025-01-10",
    status: "active",
    profileAssignment: "Profile 1",
  },
  {
    id: "5",
    name: "James Choi",
    email: "choi@example.com",
    subscription: "Disney+ Standard",
    joinDate: "2025-01-22",
    status: "active",
    profileAssignment: "Profile 2",
  },
  {
    id: "6",
    name: "Jane Han",
    email: "han@example.com",
    subscription: "ChatGPT Plus",
    joinDate: "2025-03-05",
    status: "pending",
  },
  {
    id: "7",
    name: "Tom Song",
    email: "song@example.com",
    subscription: "ChatGPT Plus",
    joinDate: "2025-02-28",
    status: "active",
    profileAssignment: "-",
  },
];

export default function ManageMembers() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const acceptRequest = (member: Member) => {
    console.log("Accept request for", member.name);
    // This would typically call a backend API
    alert(`Subscription request for ${member.name} has been approved.`);
  };
  
  const removeMember = (member: Member) => {
    console.log("Remove member", member.name);
    // This would typically call a backend API
    alert(`${member.name} has been removed from the subscription.`);
  };
  
  const openMessageDialog = (member: Member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };
  
  const sendMessage = () => {
    console.log("Send message to", selectedMember?.name);
    // This would typically call a backend API
    alert(`Message sent to ${selectedMember?.name}.`);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout userRole="unified">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Members</h1>
          <p className="text-muted-foreground">
            Manage your subscription members and handle requests.
          </p>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Members</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Members</CardTitle>
                <CardDescription>
                  List of members currently sharing your subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Profile Assignment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membersList
                      .filter((member) => member.status === "active")
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.subscription}</TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>{member.profileAssignment}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openMessageDialog(member)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeMember(member)}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Remove from Subscription
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  List of users who have requested to join your subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membersList
                      .filter((member) => member.status === "pending")
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.subscription}</TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => acceptRequest(member)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Request
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => removeMember(member)}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Reject Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message to Member</DialogTitle>
            <DialogDescription>
              Send a message to {selectedMember?.name}. This will be delivered via the platform messaging system and email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter your message here. Example: 'Here's how to set up your profile' or 'The password has been changed, please check it'"
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}