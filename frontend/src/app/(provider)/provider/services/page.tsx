"use client";

import { ProviderServicesManager } from "@/features/provider/services/components/ProviderServicesManager";
import { ProviderAvailabilityManager } from "@/features/provider/services/components/ProviderAvailabilityManager";
import { ProviderTimeOffManager } from "@/features/provider/services/components/ProviderTimeOffManager";
import { useState } from "react";


export default function ProviderServicesPage() {
  const [activeTab, setActiveTab] = useState<"services" | "availability" | "timeoff">("services");
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Services & Availability</h1>
        <p className="text-muted-foreground">
          Configure the services you offer and set your working schedule.
        </p>
      </div>

      <div className="flex space-x-1 border-b mb-8">
        <button 
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === "services" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          My Services
        </button>
        <button 
          onClick={() => setActiveTab("availability")}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === "availability" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Weekly Schedule
        </button>
        <button 
          onClick={() => setActiveTab("timeoff")}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === "timeoff" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Time Off
        </button>
      </div>

      <div className="mt-0">
        {activeTab === "services" && <ProviderServicesManager />}
        {activeTab === "availability" && (
          <div className="max-w-3xl">
            <ProviderAvailabilityManager />
          </div>
        )}
        {activeTab === "timeoff" && <ProviderTimeOffManager />}
      </div>
    </div>
  );
}
