"use client";

import { useState } from "react";
import { AdminDisputeList } from "@/features/admin/disputes/components/AdminDisputeList";
import { useAdminDisputes } from "@/features/admin/disputes/hooks/useAdminDisputes";
import { Button } from "@/components/ui/button";

export default function AdminDisputesPage() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useAdminDisputes({ page, limit });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispute Management</h1>
          <p className="text-muted-foreground mt-2">
            Review and resolve all customer and provider disputes.
          </p>
        </div>
      </div>

      <AdminDisputeList 
        disputes={data?.data || []} 
        isLoading={isLoading} 
        error={error} 
      />

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
            {page} / {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
