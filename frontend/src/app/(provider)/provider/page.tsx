import { ROUTES } from "@/constants/routes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Wrench, User } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboardPage() {
  return (
    <div className="flex flex-col gap-10 pb-10 max-w-7xl mx-auto">
      <section className="bg-primary/5 rounded-3xl p-8 sm:p-12 border shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          Welcome to your Provider Dashboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Manage bookings, services and profile from one place.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Bookings</CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                View and manage your customer bookings.
              </p>
              <Button render={<Link href={ROUTES.PROVIDER.BOOKINGS} />} className="w-full">
                View Bookings
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Services</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <Wrench className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Manage your service offerings and prices.
              </p>
              <Button render={<Link href={ROUTES.PROVIDER.SERVICES} />} variant="outline" className="w-full">
                Manage Services
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Profile</CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
                <User className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Update your professional profile and details.
              </p>
              <Button render={<Link href={ROUTES.PROVIDER.PROFILE} />} variant="outline" className="w-full">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
