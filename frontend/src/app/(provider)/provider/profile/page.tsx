"use client";

import { useState } from "react";
import { ProviderProfileManager } from "@/features/provider/profile/components/ProviderProfileManager";
import { ProviderDocumentsManager } from "@/features/provider/profile/components/ProviderDocumentsManager";

export default function ProviderProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "documents">("profile");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Provider Profile</h1>
        <p className="text-muted-foreground">
          Manage your public profile information and verification documents.
        </p>
      </div>

      <div className="flex space-x-1 border-b mb-8">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === "profile" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Profile Details
        </button>
        <button 
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === "documents" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          Verification Documents
        </button>
      </div>

      <div className="mt-0">
        {activeTab === "profile" && <ProviderProfileManager />}
        {activeTab === "documents" && <ProviderDocumentsManager />}
      </div>
    </div>
  );
}
