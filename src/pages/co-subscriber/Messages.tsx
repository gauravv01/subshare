import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreHorizontal, 
  ChevronLeft, 
  Paperclip, 
  User,
  Star
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  sentAt: string;
  isRead: boolean;
};

type Conversation = {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    subscription?: string;
    isAccountHolder?: boolean;
  };
  lastMessage: Message;
  unreadCount: number;
};

export default function Messages() {
  const isMobile = useIsMobile();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  
  // Sample conversations data for co-subscriber
  const conversations: Conversation[] = [
    {
      id: "1",
      participant: {
        id: "101",
        name: "Netflix Premium",
        subscription: "Account Holder: John Smith",
        isAccountHolder: true
      },
      lastMessage: {
        id: "m1",
        content: "Thank you for joining my Netflix subscription! Here are the login details.",
        sender: {
          id: "101",
          name: "John Smith"
        },
        sentAt: "2025-04-03T14:30:00",
        isRead: false
      },
      unreadCount: 1
    },
    {
      id: "2",
      participant: {
        id: "102",
        name: "Spotify Family",
        subscription: "Account Holder: Sarah Rodriguez",
        isAccountHolder: true
      },
      lastMessage: {
        id: "m2",
        content: "Your May payment is due soon, please make sure to send it by the 1st.",
        sender: {
          id: "102",
          name: "Sarah Rodriguez"
        },
        sentAt: "2025-04-02T09:15:00",
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: "3",
      participant: {
        id: "103",
        name: "Disney+ Premium",
        subscription: "Account Holder: Michael Chang",
        isAccountHolder: true
      },
      lastMessage: {
        id: "m3",
        content: "We have a new member joining our Disney+ account. Please update your profile name.",
        sender: {
          id: "103",
          name: "Michael Chang"
        },
        sentAt: "2025-04-01T18:45:00",
        isRead: true
      },
      unreadCount: 0
    }
  ];
  
  // Sample messages data
  const messages: { [key: string]: Message[] } = {
    "1": [
      {
        id: "m1-1",
        content: "Welcome to the Netflix Premium subscription! I'm glad you joined.",
        sender: {
          id: "101",
          name: "John Smith"
        },
        sentAt: "2025-04-02T10:30:00",
        isRead: true
      },
      {
        id: "m1-2",
        content: "Thank you for accepting me! When will I get the login details?",
        sender: {
          id: "current-user",
          name: "Me"
        },
        sentAt: "2025-04-03T09:15:00",
        isRead: true
      },
      {
        id: "m1-3",
        content: "Thank you for joining my Netflix subscription! Here are the login details.",
        sender: {
          id: "101",
          name: "John Smith"
        },
        sentAt: "2025-04-03T14:30:00",
        isRead: false
      }
    ],
    "2": [
      {
        id: "m2-1",
        content: "Hi there, welcome to my Spotify Family plan!",
        sender: {
          id: "102",
          name: "Sarah Rodriguez"
        },
        sentAt: "2025-03-15T11:30:00",
        isRead: true
      },
      {
        id: "m2-2",
        content: "Thanks for adding me. I've sent you the first month's payment.",
        sender: {
          id: "current-user",
          name: "Me"
        },
        sentAt: "2025-03-15T11:45:00",
        isRead: true
      },
      {
        id: "m2-3",
        content: "Got it! Everything is set up for you. Enjoy the service!",
        sender: {
          id: "102",
          name: "Sarah Rodriguez"
        },
        sentAt: "2025-03-15T12:00:00",
        isRead: true
      },
      {
        id: "m2-4",
        content: "Your May payment is due soon, please make sure to send it by the 1st.",
        sender: {
          id: "102",
          name: "Sarah Rodriguez"
        },
        sentAt: "2025-04-02T09:15:00",
        isRead: true
      }
    ],
    "3": [
      {
        id: "m3-1",
        content: "Welcome to Disney+! Please choose a profile name that doesn't conflict with existing members.",
        sender: {
          id: "103",
          name: "Michael Chang"
        },
        sentAt: "2025-03-20T14:30:00",
        isRead: true
      },
      {
        id: "m3-2",
        content: "I've chosen 'Alex_D' as my profile name. Is that okay?",
        sender: {
          id: "current-user",
          name: "Me"
        },
        sentAt: "2025-03-20T14:45:00",
        isRead: true
      },
      {
        id: "m3-3",
        content: "That works perfectly. I've set it up for you.",
        sender: {
          id: "103",
          name: "Michael Chang"
        },
        sentAt: "2025-03-20T15:00:00",
        isRead: true
      },
      {
        id: "m3-4",
        content: "We have a new member joining our Disney+ account. Please update your profile name.",
        sender: {
          id: "103",
          name: "Michael Chang"
        },
        sentAt: "2025-04-01T18:45:00",
        isRead: true
      }
    ]
  };
  
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (conversation.participant.subscription && conversation.participant.subscription.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "unread") {
      return matchesSearch && conversation.unreadCount > 0;
    }
    
    return matchesSearch;
  });
  
  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedConversation) return;
    
    // In a real app, this would send the message to the API
    console.log(`Sending message to conversation ${selectedConversation}: ${messageInput}`);
    
    // Clear the input
    setMessageInput("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <DashboardLayout userRole="co-subscriber">
      <div className="space-y-4 p-4 md:p-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Communicate with your subscription account holders
            </p>
          </div>
          
          <Button onClick={() => setNewMessageOpen(true)}>
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
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                              {conversation.participant.isAccountHolder ? (
                                <Star className="h-5 w-5" />
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
                            {formatDate(conversation.lastMessage.sentAt)}
                          </div>
                        </div>
                        <p className="mt-1 text-sm truncate text-muted-foreground">
                          {conversation.lastMessage.sender.id === "current-user" && "You: "}
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {conversations.find(c => c.id === selectedConversation)?.participant.isAccountHolder ? (
                          <Star className="h-5 w-5" />
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
                        <DropdownMenuItem>View service details</DropdownMenuItem>
                        <DropdownMenuItem>Rate account holder</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Leave subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                    {messages[selectedConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.sender.id === "current-user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender.id === "current-user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDate(message.sentAt)}
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
              Message your subscription account holder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription</label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Choose a subscription</option>
                <option value="netflix">Netflix Premium (John Smith)</option>
                <option value="spotify">Spotify Family (Sarah Rodriguez)</option>
                <option value="disney">Disney+ (Michael Chang)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="Optional subject line"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Type your message here..."
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageOpen(false)}>Cancel</Button>
            <Button>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}