"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProviderDocument } from "../hooks/useCreateProviderDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { parseApiError } from "@/utils/parseApiError";

const documentTypes = [
  "ID_PROOF",
  "ADDRESS_PROOF",
  "CERTIFICATION",
  "POLICE_CLEARANCE",
  "BUSINESS_LICENSE",
];

const uploadSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  documentUrl: z.string().url("Must be a valid URL").max(512),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function UploadDocumentDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createDocument, isPending, error } = useCreateProviderDocument();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      documentType: "",
      documentUrl: "",
    },
  });

  const onSubmit = (data: UploadFormValues) => {
    createDocument(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Document
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Provide the details and a publicly accessible URL for your document.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {parseApiError(error)}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type *</label>
            <Select onValueChange={(val: string | null) => { if (typeof val === "string") setValue("documentType", val); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && <p className="text-xs text-destructive">{errors.documentType.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Document URL *</label>
            <Input {...register("documentUrl")} placeholder="https://example.com/doc.pdf" />
            <p className="text-xs text-muted-foreground">
              Paste the publicly accessible URL of your uploaded document.
            </p>
            {errors.documentUrl && <p className="text-xs text-destructive">{errors.documentUrl.message}</p>}
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
