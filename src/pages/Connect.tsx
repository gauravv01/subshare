import React,   { useState } from "react";
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
import { Filter, Search, Star, Users, DollarSign, CalendarDays, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Define types
export type ServiceType = "netflix" | "spotify" | "chatgpt" | "disney" | "office" | "hbo" | "hulu" | "youtube" | "other";
export type SubscriptionCategory = "entertainment" | "productivity" | "education" | "other";
export type PlanType = "basic" | "standard" | "premium";

export interface AccountListing {
  id: string;
  service: ServiceType;
  serviceDisplay: string;
  category: SubscriptionCategory;
  plan: PlanType;
  planDisplay: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  billingCycle: "monthly" | "yearly";
  description: string;
  accountHolder: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    memberSince: string;
  };
  features: string[];
  country: string;
  startDate: string;
}

// Sample data for the listings
export const sampleListings: AccountListing[] = [
  {
    id: "listing1",
    service: "netflix",
    serviceDisplay: "Netflix",
    category: "entertainment",
    plan: "premium",
    planDisplay: "Premium 4K",
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: 4.99,
    billingCycle: "monthly",
    description: "Netflix Premium account with 4K streaming. Looking for reliable co-subscribers.",
    accountHolder: {
      id: "user1",
      name: "Emma Johnson",
      rating: 4.8,
      reviews: 12,
      memberSince: "2024-10"
    },
    features: ["4K+HDR quality", "Watch on 4 screens at a time", "Downloads on up to 4 devices"],
    country: "United States",
    startDate: "2025-04-10",
  },
  {
    id: "listing2",
    service: "disney",
    serviceDisplay: "Disney+",
    category: "entertainment",
    plan: "premium",
    planDisplay: "Premium Bundle",
    availableSeats: 3,
    totalSeats: 4,
    pricePerSeat: 3.50,
    billingCycle: "monthly",
    description: "Disney+ premium bundle with Hulu and ESPN+. Family-friendly content.",
    accountHolder: {
      id: "user2",
      name: "Noah Williams",
      rating: 4.6,
      reviews: 8,
      memberSince: "2024-09"
    },
    features: ["4K+HDR quality", "Watch on 4 devices simultaneously", "Downloads for offline viewing"],
    country: "Canada",
    startDate: "2025-04-15",
  },
  {
    id: "listing3",
    service: "spotify",
    serviceDisplay: "Spotify",
    category: "entertainment",
    plan: "premium",
    planDisplay: "Family Plan",
    availableSeats: 4,
    totalSeats: 6,
    pricePerSeat: 2.99,
    billingCycle: "monthly",
    description: "Spotify Family Plan. Ad-free music streaming with high quality audio.",
    accountHolder: {
      id: "user3",
      name: "Sophia Brown",
      rating: 4.9,
      reviews: 15,
      memberSince: "2024-07"
    },
    features: ["Ad-free music", "High quality audio", "Offline listening", "Separate accounts"],
    country: "United Kingdom",
    startDate: "2025-04-05",
  },
  {
    id: "listing4",
    service: "office",
    serviceDisplay: "Microsoft 365",
    category: "productivity",
    plan: "premium",
    planDisplay: "Family Plan",
    availableSeats: 3,
    totalSeats: 6,
    pricePerSeat: 2.50,
    billingCycle: "yearly",
    description: "Microsoft 365 Family subscription. Access to all Office apps and 1TB of cloud storage per person.",
    accountHolder: {
      id: "user4",
      name: "Liam Davis",
      rating: 4.7,
      reviews: 10,
      memberSince: "2024-08"
    },
    features: ["Full Office suite", "1TB OneDrive storage per person", "Premium features"],
    country: "Australia",
    startDate: "2025-04-01",
  },
  {
    id: "listing5",
    service: "chatgpt",
    serviceDisplay: "ChatGPT Plus",
    category: "education",
    plan: "standard",
    planDisplay: "Plus Subscription",
    availableSeats: 1,
    totalSeats: 1,
    pricePerSeat: 10.00,
    billingCycle: "monthly",
    description: "ChatGPT Plus subscription with access to GPT-4 and other premium features.",
    accountHolder: {
      id: "user5",
      name: "Olivia Smith",
      rating: 4.5,
      reviews: 6,
      memberSince: "2024-11"
    },
    features: ["Access to GPT-4", "Faster response times", "Priority access to new features"],
    country: "Germany",
    startDate: "2025-04-20",
  },
  {
    id: "listing6",
    service: "hbo",
    serviceDisplay: "HBO Max",
    category: "entertainment",
    plan: "standard",
    planDisplay: "Ad-Free",
    availableSeats: 2,
    totalSeats: 3,
    pricePerSeat: 5.99,
    billingCycle: "monthly",
    description: "HBO Max ad-free plan with access to all HBO content and exclusive Max Originals.",
    accountHolder: {
      id: "user6",
      name: "James Miller",
      rating: 4.4,
      reviews: 7,
      memberSince: "2024-10"
    },
    features: ["Ad-free streaming", "Full HD quality", "Download for offline viewing"],
    country: "United States",
    startDate: "2025-04-12",
  },
  {
    id: "listing7",
    service: "hulu",
    serviceDisplay: "Hulu",
    category: "entertainment",
    plan: "premium",
    planDisplay: "No Ads",
    availableSeats: 1,
    totalSeats: 2,
    pricePerSeat: 6.49,
    billingCycle: "monthly",
    description: "Hulu (No Ads) plan with access to all Hulu content without advertisements.",
    accountHolder: {
      id: "user7",
      name: "Ava Wilson",
      rating: 4.3,
      reviews: 5,
      memberSince: "2024-12"
    },
    features: ["No advertisements", "Full library access", "Next-day TV shows"],
    country: "United States",
    startDate: "2025-04-15",
  },
  {
    id: "listing8",
    service: "youtube",
    serviceDisplay: "YouTube Premium",
    category: "entertainment",
    plan: "standard",
    planDisplay: "Family Plan",
    availableSeats: 3,
    totalSeats: 5,
    pricePerSeat: 3.99,
    billingCycle: "monthly",
    description: "YouTube Premium Family Plan with ad-free videos, background play, and YouTube Music.",
    accountHolder: {
      id: "user8",
      name: "Isabella Taylor",
      rating: 4.7,
      reviews: 9,
      memberSince: "2024-09"
    },
    features: ["Ad-free videos", "Background play", "YouTube Music Premium", "Offline downloads"],
    country: "Canada",
    startDate: "2025-04-08",
  },
];

export default function Connect() {
  const [filteredListings, setFilteredListings] = useState<AccountListing[]>(sampleListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  // Function to get unique countries from the listings
  const getUniqueCountries = () => {
    const countries = sampleListings.map(listing => listing.country);
    // Use Array.from instead of spread operator for Set conversion
    return Array.from(new Set(countries)).sort();
  };
  
  // Apply filters
  const applyFilters = () => {
    let results = [...sampleListings];
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(listing => 
        listing.serviceDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply service filter
    if (selectedService && selectedService !== "all") {
      results = results.filter(listing => listing.service === selectedService);
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      results = results.filter(listing => listing.category === selectedCategory);
    }
    
    // Apply country filter
    if (selectedCountry && selectedCountry !== "all") {
      results = results.filter(listing => listing.country === selectedCountry);
    }
    
    // Apply sorting
    if (sortBy === "price-low") {
      results.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    } else if (sortBy === "available-seats") {
      results.sort((a, b) => b.availableSeats - a.availableSeats);
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.accountHolder.rating - a.accountHolder.rating);
    }
    
    setFilteredListings(results);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService(undefined);
    setSelectedCategory(undefined);
    setSelectedCountry(undefined);
    setSortBy("recommended");
    setFilteredListings(sampleListings);
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
  const getServiceColor = (service: ServiceType) => {
    const colors: Record<ServiceType, string> = {
      netflix: "bg-red-100 text-red-600",
      spotify: "bg-green-100 text-green-600",
      chatgpt: "bg-blue-100 text-blue-600",
      disney: "bg-purple-100 text-purple-600",
      office: "bg-indigo-100 text-indigo-600",
      hbo: "bg-purple-100 text-purple-600",
      hulu: "bg-green-100 text-green-600",
      youtube: "bg-red-100 text-red-600",
      other: "bg-gray-100 text-gray-600"
    };
    
    return colors[service] || "bg-gray-100 text-gray-600";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
                      <SelectItem value="netflix">Netflix</SelectItem>
                      <SelectItem value="disney">Disney+</SelectItem>
                      <SelectItem value="spotify">Spotify</SelectItem>
                      <SelectItem value="office">Microsoft 365</SelectItem>
                      <SelectItem value="chatgpt">ChatGPT Plus</SelectItem>
                      <SelectItem value="hbo">HBO Max</SelectItem>
                      <SelectItem value="hulu">Hulu</SelectItem>
                      <SelectItem value="youtube">YouTube Premium</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
            <p className="text-sm text-gray-500">{filteredListings.length} results</p>
          </div>
          
          {filteredListings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500 mb-4">No subscription shares found matching your criteria</p>
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <NavLink key={listing.id} to={`/listing/${listing.id}`}>
                  <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getServiceColor(listing.service)}`}>
                            {listing.serviceDisplay.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <CardTitle className="text-lg">{listing.serviceDisplay}</CardTitle>
                            <p className="text-sm text-gray-500">{listing.planDisplay}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={listing.billingCycle === "monthly" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}>
                          {listing.billingCycle === "monthly" ? "Monthly" : "Yearly"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {listing.availableSeats} of {listing.totalSeats} available
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          <span>${listing.pricePerSeat.toFixed(2)}/month</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          <span>{listing.accountHolder.rating} ({listing.accountHolder.reviews})</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                          <span>Starts {new Date(listing.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {listing.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="font-normal">
                            {feature}
                          </Badge>
                        ))}
                        {listing.features.length > 2 && (
                          <Badge variant="secondary" className="font-normal">
                            +{listing.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {listing.country}
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary gap-1 p-0">
                        View Details <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}