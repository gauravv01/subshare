import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { MoreHorizontal, Mail, UserX, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { useSubscriptions } from "../../context/SubscriptionProvider";
import { useMembers } from "../../context/MemberProvider";
import { useMessages } from "../../context/MessageProvider";
import { format } from "date-fns";

export default function ManageMembers() {
  const { toast } = useToast();
  const { subscriptionId } = useParams();
  const { subscriptions, fetchSubscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { members, fetchMembers, updateMemberRole, removeMember, isLoading: membersLoading } = useMembers();
  const { sendMessage, isLoading: messageLoading } = useMessages();
  
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<any | null>(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchSubscriptions();
        
        if (subscriptionId) {
          await fetchMembers(subscriptionId);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load members data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [subscriptionId]);
  
  // Set current subscription when subscriptions are loaded
  useEffect(() => {
    if (subscriptionId && subscriptions.length > 0) {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      setCurrentSubscription(subscription);
    }
  }, [subscriptionId, subscriptions]);
  
  // Filter active and pending members
  const activeMembers = members.filter(member => member.status === 'ACTIVE');
  const pendingMembers = members.filter(member => member.status === 'PENDING');
  
  const handleAcceptRequest = async (member: any) => {
    try {
      await updateMemberRole(member.subscriptionId, member.userId, 'MEMBER');
      toast({
        title: "Success",
        description: `Subscription request for ${member.user?.name || 'member'} has been approved.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveMember = async (member: any) => {
    try {
      await removeMember(member.subscriptionId, member.userId);
      toast({
        title: "Success",
        description: `${member.user?.name || 'Member'} has been removed from the subscription.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const openMessageDialog = (member: any) => {
    setSelectedMember(member);
    setMessageText("");
    setIsDialogOpen(true);
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedMember) return;
    
    try {
        await sendMessage(
          selectedMember.userId,
          messageText,
          'TEXT'
        );
      
      toast({
        title: "Success",
        description: `Message sent to ${selectedMember.user?.name || 'member'}.`,
      });
      
      setIsDialogOpen(false);
      setMessageText("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || subscriptionsLoading) {
    return (
      <DashboardLayout userRole="unified">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading members data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="unified">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Members</h1>
          <p className="text-muted-foreground">
            {currentSubscription 
              ? `Manage members for ${currentSubscription.title}`
              : 'Manage your subscription members and handle requests.'}
          </p>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Members ({activeMembers.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests ({pendingMembers.length})</TabsTrigger>
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
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : activeMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active members found for this subscription.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Profile Assignment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.user?.name || 'Unknown'}</TableCell>
                          <TableCell>{member.user?.email || 'Unknown'}</TableCell>
                          <TableCell>{format(new Date(member.joinedAt), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>{member.accessProfile || '-'}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleRemoveMember(member)}>
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
                )}
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
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : pendingMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending requests found for this subscription.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.user?.name || 'Unknown'}</TableCell>
                          <TableCell>{member.user?.email || 'Unknown'}</TableCell>
                          <TableCell>{format(new Date(member.joinedAt), 'yyyy-MM-dd')}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleAcceptRequest(member)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Request
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRemoveMember(member)}>
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
                )}
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
              Send a message to {selectedMember?.user?.name || 'member'}. This will be delivered via the platform messaging system and email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter your message here. Example: 'Here's how to set up your profile' or 'The password has been changed, please check it'"
              className="min-h-[100px]"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={messageLoading}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={messageLoading || !messageText.trim()}>
              {messageLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}