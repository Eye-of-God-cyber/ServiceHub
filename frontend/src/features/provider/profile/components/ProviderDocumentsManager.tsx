"use client";

import { useProviderDocuments } from "../hooks/useProviderDocuments";
import { useDeleteProviderDocument } from "../hooks/useDeleteProviderDocument";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { VERIFICATION_STATUS_BADGE_MAP } from "../constants/verification-status";
import { Trash2 } from "lucide-react";
import { parseApiError } from "@/utils/parseApiError";

import { useState } from "react";

export function ProviderDocumentsManager() {
  const { data: documents, isLoading, isError, error: fetchError } = useProviderDocuments();
  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteProviderDocument();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-4 text-center">Loading documents...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">{parseApiError(fetchError)}</div>;
  }

  const handleDelete = (docId: string) => {
    setDeleteError(null);
    deleteDocument(docId, {
      onError: (err) => {
        setDeleteError(parseApiError(err));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Documents</h2>
          <p className="text-sm text-muted-foreground">Manage your verification documents.</p>
        </div>
        <UploadDocumentDialog />
      </div>

      {deleteError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {deleteError}
        </div>
      )}

      {documents?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-muted-foreground mb-4">You have not uploaded any documents.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents?.map((doc) => {
            const badgeVariant = VERIFICATION_STATUS_BADGE_MAP[doc.status] || "secondary";

            return (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base truncate" title={doc.documentType.replace("_", " ")}>
                      {doc.documentType.replace("_", " ")}
                    </CardTitle>
                    <Badge variant={badgeVariant}>{doc.status}</Badge>
                  </div>
                  <CardDescription>
                    Uploaded on {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(doc.uploadedAt))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      View Document
                    </a>
                  </div>
                  
                  {doc.adminNotes && (
                    <div className="bg-muted p-2 rounded-md text-xs">
                      <strong>Admin Notes:</strong> {doc.adminNotes}
                    </div>
                  )}

                  {doc.status !== "APPROVED" && (
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
