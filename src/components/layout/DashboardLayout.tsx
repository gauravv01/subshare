import React, { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronRight,
  Home,
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  CreditCard, 
  MessageSquare,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
  Bell,
  UserCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { useAuth } from "../../context/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
};

const user:any=localStorage.getItem("user");
const token=localStorage.getItem("token");

// Add new animations
const sidebarAnimation = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.2 } }
};

const SidebarItem = ({ icon, label, href, active, onClick }: SidebarItemProps) => {
  return (
    <NavLink to={href}>
      <motion.div 
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200",
          active ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-accent/50"
        )}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
        {active && <ChevronRight className="ml-auto h-5 w-5 text-primary" />}
      </motion.div>
    </NavLink>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

// Add error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
};

export default function DashboardLayout({ 
  children, 

}: DashboardLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const renderNavItems = (onClick?: () => void) => (
    <nav className="space-y-1">
   {!token &&   <SidebarItem 
        icon={<Home className="h-5 w-5" />} 
        label="Home" 
        href="/"
        active={location.pathname === "/"} 
        onClick={onClick}
      />}
      
      {userRole === "ADMIN" && (
        <>
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            href="/admin" 
            active={location.pathname === "/admin"}
            onClick={onClick}
          />
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Admin Menu</p>
          </div>
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Manage Services" 
            href="/admin/services" 
            active={location.pathname === "/admin/services"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="User Management" 
            href="/admin/users" 
            active={location.pathname === "/admin/users"}
            onClick={onClick}
          />
        </>
      )}

      {userRole === "UNIFIED" && (
        <>
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            href="/dashboard" 
            active={location.pathname === "/dashboard"}
            onClick={onClick}
          />
          
          <SidebarItem 
            icon={<PlusCircle className="h-5 w-5" />} 
            label="Create Subscription" 
            href="/create-subscription" 
            active={location.pathname === "/create-subscription"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="Manage Members" 
            href="/manage-members" 
            active={location.pathname === "/manage-members"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<Search className="h-5 w-5" />} 
            label="Find Subscriptions" 
            href="/find-subscriptions" 
            active={location.pathname === "/find-subscriptions" || location.pathname === "/connect"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<CreditCard className="h-5 w-5" />} 
            label="My Subscriptions" 
            href="/my-subscriptions" 
            active={location.pathname === "/my-subscriptions"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Messages" 
            href="/messages" 
            active={location.pathname === "/messages"}
            onClick={onClick}
          />
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            href="/settings" 
            active={location.pathname === "/settings"}
            onClick={onClick}
          />
        </>
      )}
    </nav>
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userRole = localStorage.getItem("userRole");

  // Add error handling
  const handleError = (error: Error, info: { componentStack: string }) => {
    // Log error to your error reporting service
    console.error("Dashboard error:", error, info);
  };

  return (
  
      <TooltipProvider>
        <div className="flex min-h-screen bg-background">
          {/* Desktop Sidebar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={sidebarAnimation}
            className="hidden md:flex md:w-64 flex-col border-r bg-card"
          >
            <div className="p-6 border-b">
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                SubShare
              </motion.h2>
              <p className="text-sm text-muted-foreground mt-1">Subscription Cost-Saving Platform</p>
            </div>
            
            <ScrollArea className="flex-1 py-6 px-3">
              {renderNavItems()}
            </ScrollArea>
            
            <div className="border-t p-4">
              <Button 
                variant="ghost" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </motion.div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Enhanced Top navbar */}
            <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 py-3">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-primary">SubShare</h2>
                            <p className="text-sm text-gray-500 mt-1">Subscription Sharing</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto py-4 px-3">
                          {renderNavItems(closeMobileMenu)}
                        </div>
                        
                        <div className="border-t p-4">
                          <button className="flex items-center text-red-500 hover:text-red-600 w-full" onClick={handleLogout}>
                            <LogOut className="h-5 w-5 mr-2" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative group">
                        <Bell className="h-5 w-5 transition-colors group-hover:text-primary" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white group-hover:bg-red-600 transition-colors">
                          3
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end">
                      <p>You have 3 unread notifications</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 transition-all duration-200 cursor-pointer">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"  />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </header>
            
            {/* Improve mobile menu with better animation */}
            <AnimatePresence mode="wait">
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 z-50 md:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-primary">SubShare</h2>
                            <p className="text-sm text-gray-500 mt-1">Subscription Sharing</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto py-4 px-3">
                          {renderNavItems(closeMobileMenu)}
                        </div>
                        
                        <div className="border-t p-4">
                          <button className="flex items-center text-red-500 hover:text-red-600 w-full" onClick={handleLogout}>
                            <LogOut className="h-5 w-5 mr-2" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </SheetTrigger>
                  </Sheet>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Improve mobile navigation animation */}
            <AnimatePresence mode="wait">
              {(userRole === "UNIFIED" || !userRole) && (
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-md z-30"
                >
                  <div className="flex items-center justify-around">
                    <NavLink to="/dashboard" className="py-3 flex flex-col items-center w-1/5">
                      <LayoutDashboard className={`h-5 w-5 ${location.pathname === "/dashboard" || location.pathname === "/my-subscriptions" ? "text-primary" : "text-gray-500"}`} />
                      <span className="text-xs mt-1">Dashboard</span>
                    </NavLink>
                    <NavLink to="/create-subscription" className="py-3 flex flex-col items-center w-1/5">
                      <PlusCircle className={`h-5 w-5 ${location.pathname === "/create-subscription" ? "text-primary" : "text-gray-500"}`} />
                      <span className="text-xs mt-1">Create</span>
                    </NavLink>
                    <NavLink to="/find-subscriptions" className="py-3 flex flex-col items-center w-1/5">
                      <Search className={`h-5 w-5 ${location.pathname === "/find-subscriptions" || location.pathname === "/connect" ? "text-primary" : "text-gray-500"}`} />
                      <span className="text-xs mt-1">Find</span>
                    </NavLink>
                    <NavLink to="/messages" className="py-3 flex flex-col items-center w-1/5">
                      <MessageSquare className={`h-5 w-5 ${location.pathname === "/messages" ? "text-primary" : "text-gray-500"}`} />
                      <span className="text-xs mt-1">Messages</span>
                    </NavLink>
                    <NavLink to="/settings" className="py-3 flex flex-col items-center w-1/5">
                      <Settings className={`h-5 w-5 ${location.pathname === "/settings" ? "text-primary" : "text-gray-500"}`} />
                      <span className="text-xs mt-1">Settings</span>
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Improve main content area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
            
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
            </main>
          </div>
        </div>
      </TooltipProvider>
  );
}