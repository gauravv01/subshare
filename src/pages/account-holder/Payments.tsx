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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon, DownloadIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Payment = {
  id: string;
  member: string;
  subscription: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  date: string;
  status: "completed" | "pending" | "failed";
};

const paymentsData: Payment[] = [
  {
    id: "P001",
    member: "John Smith",
    subscription: "Netflix Premium",
    amount: 4500,
    platformFee: 450,
    netAmount: 4050,
    date: "2025-03-15",
    status: "completed",
  },
  {
    id: "P002",
    member: "Emily Johnson",
    subscription: "Netflix Premium",
    amount: 4500,
    platformFee: 450,
    netAmount: 4050,
    date: "2025-03-15",
    status: "completed",
  },
  {
    id: "P003",
    member: "Michael Chen",
    subscription: "Netflix Premium",
    amount: 4500,
    platformFee: 450,
    netAmount: 4050,
    date: "2025-03-15",
    status: "completed",
  },
  {
    id: "P004",
    member: "Sarah Davis",
    subscription: "Disney+ Standard",
    amount: 4900,
    platformFee: 490,
    netAmount: 4410,
    date: "2025-03-10",
    status: "completed",
  },
  {
    id: "P005",
    member: "David Wilson",
    subscription: "Disney+ Standard",
    amount: 4900,
    platformFee: 490,
    netAmount: 4410,
    date: "2025-03-10",
    status: "completed",
  },
  {
    id: "P006",
    member: "Thomas Brown",
    subscription: "ChatGPT Plus",
    amount: 6700,
    platformFee: 670,
    netAmount: 6030,
    date: "2025-03-05",
    status: "completed",
  },
  {
    id: "P007",
    member: "Jessica Lee",
    subscription: "ChatGPT Plus",
    amount: 6700,
    platformFee: 670,
    netAmount: 6030,
    date: "2025-04-05",
    status: "pending",
  },
];

// Calculate total amounts
const totalIncome = paymentsData
  .filter(payment => payment.status === "completed")
  .reduce((total, payment) => total + payment.netAmount, 0);

const upcomingIncome = paymentsData
  .filter(payment => payment.status === "pending")
  .reduce((total, payment) => total + payment.netAmount, 0);

const platformFees = paymentsData
  .filter(payment => payment.status === "completed")
  .reduce((total, payment) => total + payment.platformFee, 0);

export default function Payments() {
  return (
    <DashboardLayout userRole="account-holder">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            View payment and settlement details from your subscribers.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Amount after platform fees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${upcomingIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Next scheduled payment amount
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${platformFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                10% of each payment
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Upcoming</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="disney">Disney+</SelectItem>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            <PaymentsTable payments={paymentsData} />
          </TabsContent>
          
          <TabsContent value="completed">
            <PaymentsTable 
              payments={paymentsData.filter(p => p.status === "completed")} 
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <PaymentsTable 
              payments={paymentsData.filter(p => p.status === "pending")} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Net Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.member}</TableCell>
                <TableCell>{payment.subscription}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>${payment.platformFee.toLocaleString()}</TableCell>
                <TableCell>${payment.netAmount.toLocaleString()}</TableCell>
                <TableCell className="flex items-center">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {payment.date}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: Payment["status"] }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
          Failed
        </Badge>
      );
  }
}