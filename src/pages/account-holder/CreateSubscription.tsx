import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Form validation schema
const formSchema = z.object({
  service: z.string().min(1, { message: "서비스를 선택해주세요" }),
  plan: z.string().min(1, { message: "요금제를 선택해주세요" }),
  totalSeats: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 2 && Number(val) <= 6, {
    message: "공유 가능 자리 수는 2~6명 사이여야 합니다",
  }),
  pricePerSeat: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "자리당 가격을 입력해주세요",
  }),
  billingCycle: z.enum(["monthly", "annually"], {
    required_error: "결제 주기를 선택해주세요",
  }),
  accountEmail: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
  accountPassword: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
  profileAssignment: z.string().min(1, { message: "프로필 배정 방법을 설명해주세요" }),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "서비스 이용약관에 동의해주세요",
  }),
  // Optional fields for custom entries
  customService: z.string().optional(),
  customPlan: z.string().optional(),
});

// Service options
const services = [
  { value: "netflix", label: "Netflix" },
  { value: "disney", label: "Disney+" },
  { value: "spotify", label: "Spotify" },
  { value: "youtube", label: "YouTube Premium" },
  { value: "apple", label: "Apple One" },
  { value: "office", label: "Microsoft 365" },
  { value: "adobe", label: "Adobe Creative Cloud" },
  { value: "chatgpt", label: "ChatGPT Plus" },
  { value: "notion", label: "Notion" },
  { value: "custom", label: "Custom (Enter manually)" },
];

// Plan options by service
const plansByService: Record<string, Array<{ value: string; label: string; price: number }>> = {
  netflix: [
    { value: "basic", label: "Basic", price: 9900 },
    { value: "standard", label: "Standard", price: 13500 },
    { value: "premium", label: "Premium", price: 17000 },
  ],
  disney: [
    { value: "standard", label: "Standard", price: 9900 },
    { value: "premium", label: "Premium", price: 13900 },
  ],
  spotify: [
    { value: "individual", label: "Individual", price: 10900 },
    { value: "duo", label: "Duo", price: 14900 },
    { value: "family", label: "Family", price: 16900 },
  ],
  youtube: [
    { value: "individual", label: "Individual", price: 14900 },
    { value: "family", label: "Family", price: 22900 },
  ],
  apple: [
    { value: "individual", label: "Individual", price: 13900 },
    { value: "family", label: "Family", price: 19900 },
  ],
  office: [
    { value: "personal", label: "Personal", price: 11900 },
    { value: "family", label: "Family", price: 12400 },
  ],
  adobe: [
    { value: "photography", label: "Photography", price: 13000 },
    { value: "all-apps", label: "All Apps", price: 75000 },
  ],
  chatgpt: [
    { value: "plus", label: "Plus", price: 20000 },
    { value: "team", label: "Team", price: 30000 },
  ],
  notion: [
    { value: "plus", label: "Plus", price: 10000 },
    { value: "business", label: "Business", price: 20000 },
  ],
  custom: [
    { value: "custom", label: "Custom", price: 0 },
  ],
};

export default function CreateSubscription() {
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [recommendedPrice, setRecommendedPrice] = React.useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [isCustomService, setIsCustomService] = React.useState<boolean>(false);
  
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
    
    if (selectedService && plansByService[selectedService]) {
      const selectedPlan = plansByService[selectedService].find(plan => plan.value === value);
      if (selectedPlan && !isCustomService) {
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
    
    if (selectedService && form.getValues("plan")) {
      const selectedPlan = plansByService[selectedService].find(
        plan => plan.value === form.getValues("plan")
      );
      
      if (selectedPlan && !isCustomService && seats > 0) {
        const recommended = Math.round(selectedPlan.price / seats * 0.85);
        setRecommendedPrice(recommended);
        form.setValue("pricePerSeat", recommended.toString());
      }
    }
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsDialogOpen(true);
  }

  return (
    <DashboardLayout userRole="unified">
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
                                  <SelectItem key={service.value} value={service.value}>
                                    {service.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {isCustomService && (
                        <FormField
                          control={form.control}
                          name="customService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Input</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter service name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
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
                                {selectedService &&
                                  plansByService[selectedService]?.map((plan) => (
                                    <SelectItem key={plan.value} value={plan.value}>
                                      {plan.label}
                                      {!isCustomService && ` ($${plan.price.toLocaleString()})`}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {selectedService === "custom" && form.watch("plan") === "custom" && (
                        <FormField
                          control={form.control}
                          name="customPlan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Plan</FormLabel>
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
                                  <RadioGroupItem value="annually" />
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
                  <Button type="submit">Create Subscription</Button>
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
            <Button onClick={() => setIsDialogOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}