import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Filter, Search, Star, Users, DollarSign, CalendarDays, ChevronRight, Loader2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSubscriptions } from "../context/SubscriptionProvider";
import { useServices } from "../context/ServiceProvider";
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Connect() {
  const { toast } = useToast();
  const { subscriptions, fetchSubscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { services, fetchServices, isLoading: servicesLoading } = useServices();
  
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchSubscriptions(),
          fetchServices()
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subscription data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Update filtered subscriptions when data changes
  useEffect(() => {
    if (subscriptions.length > 0) {
      setFilteredSubscriptions(subscriptions.filter(sub => 
        sub.visibility === 'PUBLIC' && 
        sub.status === 'ACTIVE' &&
        sub.members.length < sub.maxMembers
      ));
    }
  }, [subscriptions]);
  
  // Function to get unique countries from the subscriptions
  const getUniqueCountries = () => {
    if (!subscriptions.length) return [];
    
    const countries = subscriptions
      .map(sub => sub.owner?.country)
      .filter(Boolean);
      
    return Array.from(new Set(countries)).sort();
  };
  
  // Function to get unique categories from services
  const getUniqueCategories = () => {
    if (!services.length) return [];
    
    const categories = services
      .map(service => service.category)
      .filter(Boolean);
      
    return Array.from(new Set(categories)).sort();
  };
  
  // Apply filters
  const applyFilters = () => {
    let results = [...subscriptions].filter(sub => 
      sub.visibility === 'PUBLIC' && 
      sub.status === 'ACTIVE' &&
      sub.members.length < sub.maxMembers
    );
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(sub => 
        sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply service filter
    if (selectedService && selectedService !== "all") {
      results = results.filter(sub => sub.serviceId === selectedService);
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
        results = results.filter(sub => sub.service?.category === selectedCategory);
    }
    
    // Apply country filter
    if (selectedCountry && selectedCountry !== "all") {
      results = results.filter(sub => sub.owner?.country === selectedCountry);
    }
    
    // Apply sorting
    if (sortBy === "price-low") {
      results.sort((a, b) => (a.price / a.maxMembers) - (b.price / b.maxMembers));
    } else if (sortBy === "price-high") {
      results.sort((a, b) => (b.price / b.maxMembers) - (a.price / a.maxMembers));
    } else if (sortBy === "available-seats") {
      results.sort((a, b) => (a.maxMembers - a.members.length) - (b.maxMembers - b.members.length));
    } else if (sortBy === "rating") {
      // Sort by owner rating if available
      results.sort((a, b) => {
        const aRating = a.owner?.receivedReviews?.reduce((sum: number, review: any) => sum + review.rating, 0) / 
                       (a.owner?.receivedReviews?.length || 1);
        const bRating = b.owner?.receivedReviews?.reduce((sum: number, review: any) => sum + review.rating, 0) / 
                       (b.owner?.receivedReviews?.length || 1);
        return bRating - aRating;
      });
    }
    
    setFilteredSubscriptions(results);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService(undefined);
    setSelectedCategory(undefined);
    setSelectedCountry(undefined);
    setSortBy("recommended");
    
    setFilteredSubscriptions(subscriptions.filter(sub => 
      sub.visibility === 'PUBLIC' && 
      sub.status === 'ACTIVE' &&
      sub.members.length < sub.maxMembers
    ));
  };
  
  // Filter when search or filters change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setTimeout(applyFilters, 300);
  };
  
  const handleServiceChange = (value: string) => {
    setSelectedService(value === "all" ? undefined : value);
    setTimeout(applyFilters, 100);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? undefined : value);
    setTimeout(applyFilters, 100);
  };
  
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value === "all" ? undefined : value);
    setTimeout(applyFilters, 100);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setTimeout(applyFilters, 100);
  };
  
  // Service icon styling based on service name
  const getServiceColor = (service: any) => {
    const colors: Record<string, string> = {
      'STREAMING': "bg-red-100 text-red-600",
      'GAMING': "bg-purple-100 text-purple-600",
      'PRODUCTIVITY': "bg-blue-100 text-blue-600",
      'EDUCATION': "bg-green-100 text-green-600",
      'MUSIC': "bg-indigo-100 text-indigo-600",
      'FITNESS': "bg-orange-100 text-orange-600",
      'OTHER': "bg-gray-100 text-gray-600"
    };
    
    return colors[service?.category] || "bg-gray-100 text-gray-600";
  };
  
  if (isLoading || subscriptionsLoading || servicesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading subscriptions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <DashboardLayout>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Find Subscription Shares</h1>
          <p className="text-gray-500 mt-2">
            Connect with others and share the cost of your favorite subscription services
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by service name or description..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="available-seats">Available Seats</SelectItem>
              <SelectItem value="rating">Host Rating</SelectItem>
            </SelectContent>
          </Select>
          
          <div>
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => document.getElementById("filters-accordion")?.click()}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="filters">
            <AccordionTrigger id="filters-accordion">Advanced Filters</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Service</label>
                  <Select onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Country</label>
                  <Select onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {getUniqueCountries().map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Subscriptions</h2>
            <p className="text-sm text-gray-500">{filteredSubscriptions.length} results</p>
          </div>
          
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500 mb-4">No subscription shares found matching your criteria</p>
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map(subscription => {
                const availableSeats = subscription.maxMembers - subscription.members.length;
                const pricePerSeat = subscription.price / subscription.maxMembers;
                const ownerRating = subscription.owner?.receivedReviews?.reduce(
                  (sum: number, review: any) => sum + review.rating, 0
                ) / (subscription.owner?.receivedReviews?.length || 1) || 0;
                const reviewCount = subscription.owner?.receivedReviews?.length || 0;
                
                return (
                  <NavLink key={subscription.id} to={`/listing/${subscription.id}`}>
                    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getServiceColor(subscription.service)}`}>
                              {subscription.service?.logo ? (
                                <img 
                                  src={subscription.service.logo} 
                                  alt={subscription.service.name} 
                                  className="w-6 h-6"
                                />
                              ) : (
                                subscription.title.charAt(0)
                              )}
                            </div>
                            <div className="ml-2">
                              <CardTitle className="text-lg">{subscription.title}</CardTitle>
                              <p className="text-sm text-gray-500">{subscription.service?.name || 'Custom Subscription'}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={subscription.cycle === "MONTHLY" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}>
                            {subscription.cycle.charAt(0) + subscription.cycle.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{subscription.description || 'No description provided'}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>
                              {availableSeats} of {subscription.maxMembers} available
                            </span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                            <span>${pricePerSeat.toFixed(2)}/month</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{ownerRating.toFixed(1)} ({reviewCount})</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                            <span>
                              {subscription.createdAt 
                                ? `Started ${format(new Date(subscription.createdAt), 'MMM d, yyyy')}`
                                : 'Recently added'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {subscription.service?.features?.slice(0, 2).map((feature: string, index: number) => (
                            <Badge key={index} variant="secondary" className="font-normal">
                              {feature}
                            </Badge>
                          ))}
                          {subscription.service?.features?.length > 2 && (
                            <Badge variant="secondary" className="font-normal">
                              +{subscription.service.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {subscription.owner?.country || 'Global'}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary gap-1 p-0">
                          View Details <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
    </DashboardLayout>
  );
}