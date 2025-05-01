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

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
};

const user=localStorage.getItem("user");
const token=localStorage.getItem("token");

const SidebarItem = ({ icon, label, href, active, onClick }: SidebarItemProps) => {
  return (
    <NavLink to={href}>
      <div 
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
          active ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
        }`}
        onClick={onClick}
      >
        <div className={active ? "text-primary" : "text-gray-500"}>{icon}</div>
        <span className="font-medium">{label}</span>
        {active && <ChevronRight className="ml-auto h-5 w-5 text-primary" />}
      </div>
    </NavLink>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">SubShare</h2>
          <p className="text-sm text-gray-500 mt-1">Subscription Cost-Saving Platform</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {renderNavItems()}
        </div>
        
        <div className="border-t p-4">
          <button className="flex items-center text-red-500 hover:text-red-600" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 border-b bg-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
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
            
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-primary">SubShare</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">3</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4"  />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Mobile bottom navigation for quick access */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex items-center justify-around z-30">

          
          {(userRole === "UNIFIED" || !userRole) && (
            <>
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
            </>
          )}
          
          {userRole === "ADMIN" && (
            <>
              <NavLink to="/admin" className="py-3 flex flex-col items-center w-1/3">
                <LayoutDashboard className={`h-5 w-5 ${location.pathname === "/admin" ? "text-primary" : "text-gray-500"}`} />
                <span className="text-xs mt-1">Dashboard</span>
              </NavLink>
              <NavLink to="/admin/services" className="py-3 flex flex-col items-center w-1/3">
                <Settings className={`h-5 w-5 ${location.pathname === "/admin/services" ? "text-primary" : "text-gray-500"}`} />
                <span className="text-xs mt-1">Services</span>
              </NavLink>
              <NavLink to="/admin/users" className="py-3 flex flex-col items-center w-1/3">
                <Users className={`h-5 w-5 ${location.pathname === "/admin/users" ? "text-primary" : "text-gray-500"}`} />
                <span className="text-xs mt-1">Users</span>
              </NavLink>
            </>
          )}
        </div>
        
        {/* Page content with bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}