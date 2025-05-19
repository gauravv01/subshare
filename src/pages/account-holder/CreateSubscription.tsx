import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { CalendarIcon, Info, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSubscriptions } from "../../context/SubscriptionProvider";
import { useServices } from "../../context/ServiceProvider";
import { useToast } from "../../hooks/use-toast";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  service: z.string().min(1, "Please select a service"),
  plan: z.string().min(1, "Please select a plan"),
  totalSeats: z.string().min(1, "Please enter number of seats"),
  pricePerSeat: z.string().min(1, "Please enter price per seat"),
  billingCycle: z.string().min(1, "Please select a billing cycle"),
  accountEmail: z.string().email("Please enter a valid email"),
  accountPassword: z.string().min(6, "Password must be at least 6 characters"),
  profileAssignment: z.string().min(10, "Please provide profile assignment details"),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  customService: z.string().optional(),
  customPlan: z.string().optional(),
});

export default function CreateSubscription() {
  const { toast } = useToast();
  const { createSubscription, isLoading } = useSubscriptions();
  const { services, fetchServices } = useServices();
  
  const [selectedService, setSelectedService] = useState<string>("");
  const [recommendedPrice, setRecommendedPrice] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCustomService, setIsCustomService] = useState<boolean>(false);
  const [createdSubscription, setCreatedSubscription] = useState<any>(null);
  
  // Fetch services on component mount
  React.useEffect(() => {
    fetchServices();
  }, []);
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      plan: "",
      totalSeats: "4",
      pricePerSeat: "",
      billingCycle: "monthly",
      accountEmail: "",
      accountPassword: "",
      profileAssignment: "",
      termsAgreed: false,
      customService: "",
      customPlan: "",
    },
  });
  
  // Get plans for selected service
  const getPlansForService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.plans || [];
  };
  
  // Handle service change
  const handleServiceChange = (value: string) => {
    form.setValue("service", value);
    setSelectedService(value);
    setIsCustomService(value === "custom");
    form.setValue("plan", "");
    form.setValue("pricePerSeat", "");
    setRecommendedPrice(0);
  };
  
  // Handle plan change
  const handlePlanChange = (value: string) => {
    form.setValue("plan", value);
    
    if (selectedService && !isCustomService) {
      const plans = getPlansForService(selectedService);
      const selectedPlan = plans.find(plan => plan.id === value);
      
      if (selectedPlan) {
        const seats = parseInt(form.getValues("totalSeats") || "4");
        const recommended = Math.round(selectedPlan.price / seats * 0.85);
        setRecommendedPrice(recommended);
        form.setValue("pricePerSeat", recommended.toString());
      }
    }
  };
  
  // Handle seats change
  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seats = parseInt(e.target.value || "0");
    form.setValue("totalSeats", e.target.value);
    
    if (selectedService && form.getValues("plan") && !isCustomService) {
      const plans = getPlansForService(selectedService);
      const selectedPlan = plans.find(plan => plan.id === form.getValues("plan"));
      
      if (selectedPlan && seats > 0) {
        const recommended = Math.round(selectedPlan.price / seats * 0.85);
        setRecommendedPrice(recommended);
        form.setValue("pricePerSeat", recommended.toString());
      }
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const subscription = await createSubscription({
        service: values.service,
        customService: values.customService,
        plan: values.plan,
        customPlan: values.customPlan,
        totalSeats: parseInt(values.totalSeats),
        pricePerSeat: parseFloat(values.pricePerSeat),
        billingCycle: values.billingCycle,
        accountEmail: values.accountEmail,
        accountPassword: values.accountPassword,
        profileAssignment: values.profileAssignment,
      });
      
      setCreatedSubscription(subscription);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create subscription",
        variant: "destructive",
      });
    }
  }

  return (
    <DashboardLayout >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Subscription</h1>
          <p className="text-muted-foreground">
            Register a subscription service you want to share and earn income.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Subscription</CardTitle>
            <CardDescription>
              Enter subscription details to share with other users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Service</FormLabel>
                            <Select 
                              onValueChange={(value) => handleServiceChange(value)}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                   
                      
                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plan</FormLabel>
                            <Select
                              onValueChange={(value) => handlePlanChange(value)}
                              defaultValue={field.value}
                              disabled={!selectedService}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {!isCustomService && selectedService && 
                                  getPlansForService(selectedService).map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                      {plan.name} (${plan.price.toLocaleString()})
                                    </SelectItem>
                                  ))}
                                {isCustomService && (
                                  <SelectItem value="custom">Custom Plan</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {isCustomService && form.watch("plan") === "custom" && (
                        <FormField
                          control={form.control}
                          name="customPlan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Plan Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter plan name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="totalSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Sharing Capacity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="2" 
                                max="6" 
                                {...field} 
                                onChange={handleSeatsChange}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of people including account owner (2-6 people)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pricePerSeat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Per Seat ($)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1000" />
                            </FormControl>
                            {recommendedPrice > 0 && (
                              <FormDescription>
                                Recommended price: ${recommendedPrice.toLocaleString()} (15% discount)
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Billing Cycle</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="monthly" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Monthly Billing
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yearly" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Annual Billing
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <h3 className="text-lg font-medium">Account Information</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="accountEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Email/ID</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormDescription>
                              This information will be shared with subscribers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="accountPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormDescription>
                              Password will be stored encrypted
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="profileAssignment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Assignment Method</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Example: 'Profile 1 is for the account owner, profiles 2-4 are available for subscribers to choose' or 'Each subscriber will be assigned an individual profile'"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain how profiles will be assigned to subscribers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-start space-x-3 space-y-0 pt-4">
                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the Terms of Service and Privacy Policy
                            </FormLabel>
                            <FormDescription>
                              I have read and understood the terms of service regarding account sharing, and I agree to them.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <CardFooter className="flex justify-end px-0 pb-0">
                  <Button type="submit" disabled={isLoading} className="cursor-pointer text-black" variant="outline">
                    {isLoading ? "Creating..." : "Create Subscription"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subscription Created</DialogTitle>
            <DialogDescription>
              Your subscription has been successfully registered.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-3 rounded-md border p-4 bg-green-50">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Registration Successful</h4>
              </div>
              <p className="text-sm text-green-700">
                Other users can now join your subscription. You can review and approve subscription requests as they come in.
              </p>
            </div>
            
            {createdSubscription && (
              <div className="rounded-md border p-4">
                <h4 className="font-medium mb-2">Subscription Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Service:</span> {createdSubscription.title}</p>
                  <p><span className="font-medium">Price:</span> ${createdSubscription.price}</p>
                  <p><span className="font-medium">Billing:</span> {createdSubscription.cycle.toLowerCase()}</p>
                  <p><span className="font-medium">Max Members:</span> {createdSubscription.maxMembers}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">What's next?</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  <li>You can review and modify your subscription details if needed.</li>
                  <li>Approve participation requests and manage your subscribers.</li>
                  <li>Monitor payment history and financial status on your dashboard.</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="cursor-pointer text-black" variant="outline">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}