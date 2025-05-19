import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  ChevronLeft, 
  MoreHorizontal, 
  Paperclip,
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useIsMobile } from "../../hooks/use-mobile";
import { useMessages } from "../../context/MessageProvider";
import { useSubscriptions } from "../../context/SubscriptionProvider";
import { useMembers } from "../../context/MemberProvider";
import { useToast } from "../../hooks/use-toast";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";

export default function Messages() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { 
    messages, 
    sendMessage, 
    markAsRead, 
    fetchMessages, 
    isLoading: messagesLoading 
  } = useMessages();
  const { 
    subscriptions, 
    fetchSubscriptions, 
    isLoading: subscriptionsLoading 
  } = useSubscriptions();
  const { 
    members, 
    fetchMembers, 
    isLoading: membersLoading 
  } = useMembers();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Group messages by conversation
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationMessages, setConversationMessages] = useState<Record<string, any[]>>({});
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchMessages(),
          fetchSubscriptions()
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load messages. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Fetch members when a subscription is selected
  useEffect(() => {
    if (selectedSubscription) {
      fetchMembers(selectedSubscription);
    }
  }, [selectedSubscription]);
  
  // Process messages into conversations
  useEffect(() => {
    if (messages.length > 0) {
      // Group messages by conversation partner
      const messagesByConversation: Record<string, any[]> = {};
      const conversationMap = new Map();
      
      messages.forEach(message => {
        const partnerId = message.senderId === "current-user" ? message.receiverId : message.senderId;
        const conversationId = partnerId;
        
        if (!messagesByConversation[conversationId]) {
          messagesByConversation[conversationId] = [];
        }
        
        messagesByConversation[conversationId].push(message);
        
        // Update conversation info
        if (!conversationMap.has(conversationId)) {
          const partner = message.senderId === "current-user" ? message.receiver : message.sender;
          
          conversationMap.set(conversationId, {
            id: conversationId,
            participant: {
              id: partner.id,
              name: partner.name,
              avatar: partner.avatar,
              subscription: "Member"
            },
            lastMessage: message,
            unreadCount: message.senderId !== "current-user" && !message.read ? 1 : 0
          });
        } else {
          const conversation = conversationMap.get(conversationId);
          
          // Update last message if this one is newer
          if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
            conversation.lastMessage = message;
          }
          
          // Update unread count
          if (message.senderId !== "current-user" && !message.read) {
            conversation.unreadCount += 1;
          }
        }
      });
      
      // Sort messages in each conversation by date
      Object.keys(messagesByConversation).forEach(conversationId => {
        messagesByConversation[conversationId].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      
      // Sort conversations by last message date
      const sortedConversations = Array.from(conversationMap.values()).sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      );
      
      setConversations(sortedConversations);
      setConversationMessages(messagesByConversation);
    }
  }, [messages]);
  
  // Filter conversations based on search and active tab
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = searchQuery === "" || 
      conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || (activeTab === "unread" && conversation.unreadCount > 0);
    
    return matchesSearch && matchesTab;
  });
  
  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && conversationMessages[selectedConversation]) {
      const unreadMessages = conversationMessages[selectedConversation].filter(
        message => message.senderId !== "current-user" && !message.read
      );
      
      unreadMessages.forEach(message => {
        markAsRead(message.id);
      });
      
      // Update unread count in conversations
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    }
  }, [selectedConversation, conversationMessages]);
  
  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || !selectedConversation) return;
    
    try {
      // Make sure the receiverId exists in the database
      const receiverId = selectedConversation;
      
      // Check if this is a valid user ID before sending
      const recipient = members.find(m => m.userId === receiverId);
      
      if (!recipient) {
        toast({
          title: "Error",
          description: "Invalid recipient. Please select a valid user.",
          variant: "destructive",
        });
        return;
      }
      
      await sendMessage(
        receiverId,
        messageInput,
        'TEXT'
      );
      
      // Clear the input
      setMessageInput("");
      
      // Refresh messages
      await fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSendNewMessage = async () => {
    if (!selectedSubscription || !selectedRecipient || !newMessageText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to send a message.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Make sure the receiverId exists in the database
      if (selectedRecipient === 'all') {
        // Send to all members of the subscription
        const subscriptionMembers = members.filter(m => 
          m.subscriptionId === selectedSubscription && 
          m.userId !== 'current-user' // Don't send to yourself
        );
        
        if (subscriptionMembers.length === 0) {
          toast({
            title: "No Recipients",
            description: "There are no members to send messages to.",
            variant: "destructive",
          });
          return;
        }
        
        // Send message to each member
        await Promise.all(
          subscriptionMembers.map(member => 
            sendMessage(member.userId, newMessageText, 'TEXT')
          )
        );
      } else {
        // Send to a specific recipient
        await sendMessage(
          selectedRecipient,
          newMessageText,
          'TEXT'
        );
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      
      // Clear form and close dialog
      setSelectedSubscription("");
      setSelectedRecipient("");
      setNewMessageText("");
      setNewMessageOpen(false);
      
      // Refresh messages
      await fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day name
    } else {
      return format(date, 'MMM d');
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };
  
  if (isLoading || messagesLoading || subscriptionsLoading) {
    return (
      <DashboardLayout >
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout >
      <div className="space-y-4 p-4 md:p-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Communicate with your subscription members
            </p>
          </div>
          
          <Button onClick={() => setNewMessageOpen(true)} className="cursor-pointer text-black" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Message</span>
          </Button>
        </div>
        
        <Card className="overflow-hidden border">
          <div className="grid md:grid-cols-[320px_1fr] h-[500px] md:h-[600px]">
            {/* Conversation list - hidden on mobile when a conversation is selected */}
            <div className={`${selectedConversation && isMobile ? 'hidden' : 'flex flex-col'} border-r`}>
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs className="mt-2" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Messages</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No conversations found
                  </div>
                ) : (
                  <ul>
                    {filteredConversations.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                          selectedConversation === conversation.id ? 'bg-muted' : ''
                        } ${conversation.unreadCount > 0 ? 'bg-primary/5' : ''}`}
                        onClick={() => handleSelectConversation(conversation.id)}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                              {conversation.participant.avatar ? (
                                <img 
                                  src={conversation.participant.avatar} 
                                  alt={conversation.participant.name} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <h4 className="font-medium truncate mr-2">{conversation.participant.name}</h4>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center p-0 text-xs bg-primary">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              {conversation.participant.subscription && (
                                <p className="text-xs text-muted-foreground truncate">{conversation.participant.subscription}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0 ml-2">
                            {formatDate(conversation.lastMessage.createdAt)}
                          </div>
                        </div>
                        <p className="mt-1 text-sm truncate text-muted-foreground">
                          {conversation.lastMessage.senderId === "current-user" && "You: "}
                          {conversation.lastMessage.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Conversation view */}
            <div className={`${!selectedConversation && isMobile ? 'hidden' : 'flex flex-col'}`}>
              {selectedConversation ? (
                <>
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center gap-3">
                      {isMobile && (
                        <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        {conversations.find(c => c.id === selectedConversation)?.participant.avatar ? (
                          <img 
                            src={conversations.find(c => c.id === selectedConversation)?.participant.avatar} 
                            alt={conversations.find(c => c.id === selectedConversation)?.participant.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">
                          {conversations.find(c => c.id === selectedConversation)?.participant.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversations.find(c => c.id === selectedConversation)?.participant.subscription}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View subscription</DropdownMenuItem>
                        <DropdownMenuItem>Member details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Block member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                    {conversationMessages[selectedConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.senderId === "current-user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.senderId === "current-user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                      </div>
                      <Button onClick={handleSendMessage} className="shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Conversation Selected</h3>
                  <p className="text-muted-foreground mt-2">
                    Choose a conversation from the list or start a new one
                  </p>
                  <Button className="mt-4" onClick={() => setNewMessageOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Send a message to a subscription member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
              >
                <option value="">Choose a subscription</option>
                {subscriptions.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title} ({sub.members.length} members)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                disabled={!selectedSubscription || membersLoading}
              >
                <option value="">Choose a recipient</option>
                <option value="all">All Members</option>
                {members
                  .filter(member => member.subscriptionId === selectedSubscription)
                  .map(member => (
                    <option key={member.id} value={member.userId}>
                      {member.user?.name || 'Unknown User'}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Type your message here..."
                rows={5}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageOpen(false)}>Cancel</Button>
            <Button onClick={handleSendNewMessage} className="cursor-pointer  text-black" variant="outline">Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}