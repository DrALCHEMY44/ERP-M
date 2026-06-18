
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BusinessDocument, DocumentType } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { Loader2, UploadCloud } from "lucide-react"

const documentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(['Receipt', 'Invoice', 'Contract', 'License', 'Report', 'Employee', 'Supplier', 'Other']),
  description: z.string().optional(),
})

type DocumentFormValues = z.infer<typeof documentSchema>

interface DocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (doc: Partial<BusinessDocument>) => Promise<void>
}

export function DocumentDialog({ open, onOpenChange, onSave }: DocumentDialogProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "Other",
      description: "",
    },
  })

  const onSubmit = async (values: DocumentFormValues) => {
    setIsUploading(true)
    try {
      // In a real implementation, we would upload to Firebase Storage here
      // and get the fileUrl. For this prototype, we'll simulate it.
      const simulatedUrl = "https://example.com/simulated-file.pdf"
      
      await onSave({
        ...values,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        uploadedBy: MOCK_USER.uid,
        uploadedByName: MOCK_USER.fullName,
        uploadedAt: new Date().toISOString(),
        fileUrl: simulatedUrl,
        fileSize: "1.2 MB"
      } as BusinessDocument)
      
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UploadCloud className="size-5 text-primary" />
                Upload Document
              </DialogTitle>
              <DialogDescription>
                Files are secured in your multi-tenant storage vault.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Q1 Tax Compliance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Receipt">Receipt</SelectItem>
                        <SelectItem value="Invoice">Invoice</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="License">Business License (NIU/RCCM)</SelectItem>
                        <SelectItem value="Report">Financial Report</SelectItem>
                        <SelectItem value="Employee">Employee Document</SelectItem>
                        <SelectItem value="Supplier">Supplier Document</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about this file..." 
                        className="resize-none h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>File Attachment</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                    <UploadCloud className="size-8 text-muted-foreground" />
                    <p className="text-xs font-medium">Click or drag file to upload</p>
                    <p className="text-[10px] text-muted-foreground uppercase">PDF, JPG, PNG up to 10MB</p>
                    <input type="file" className="hidden" />
                  </div>
                </FormControl>
              </FormItem>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary font-bold uppercase text-[10px] tracking-widest px-8" disabled={isUploading}>
                {isUploading ? <Loader2 className="size-4 mr-2 animate-spin" /> : "Save Document"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
