import { ROUTES } from "@/constants/routes";
import { Users, Briefcase, CalendarCheck, Ticket, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const quickActions = [
    {
      title: "Users",
      description: "Manage customer and admin accounts",
      href: ROUTES.ADMIN.USERS,
      icon: Users,
    },
    {
      title: "Providers",
      description: "Manage provider profiles and verifications",
      href: ROUTES.ADMIN.PROVIDERS,
      icon: Briefcase,
    },
    {
      title: "Bookings",
      description: "View and manage all platform bookings",
      href: ROUTES.ADMIN.BOOKINGS,
      icon: CalendarCheck,
    },
    {
      title: "Coupons",
      description: "Create and manage promotional coupons",
      href: ROUTES.ADMIN.COUPONS,
      icon: Ticket,
    },
    {
      title: "Disputes",
      description: "Resolve customer and provider disputes",
      href: ROUTES.ADMIN.DISPUTES,
      icon: AlertTriangle,
    },
    {
      title: "Reports",
      description: "View platform statistics and analytics",
      href: ROUTES.ADMIN.REPORTS,
      icon: FileText,
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to the Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, providers, bookings and platform operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
              <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="mt-1.5">{action.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
