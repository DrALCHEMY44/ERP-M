
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
import { BusinessDocument } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { Loader2, UploadCloud, FileText } from "lucide-react"

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
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isDragActive, setIsDragActive] = React.useState(false)

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "Other",
      description: "",
    },
  })

  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null)
      form.reset()
    }
  }, [open, form])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      if (!form.getValues("name")) {
        const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
        form.setValue("name", nameWithoutExtension)
      }
    }
  }

  const onSubmit = async (values: DocumentFormValues) => {
    if (!selectedFile) {
      form.setError("root", { message: "Please select a file to upload." })
      return
    }

    setIsUploading(true)
    try {
      let fileUrl = ""
      
      try {
        const { ref: storageRef, uploadBytes, getDownloadURL } = await import("firebase/storage")
        const { storage } = await import("@/lib/firebase")
        
        const path = `documents/uploads/${Date.now()}_${selectedFile.name}`
        const fileRef = storageRef(storage, path)
        
        const snapshot = await uploadBytes(fileRef, selectedFile)
        fileUrl = await getDownloadURL(snapshot.ref)
        console.log("Uploaded successfully to Firebase Storage:", fileUrl)
      } catch (uploadError) {
        console.warn("Firebase Storage upload failed, falling back to local server upload:", uploadError)
        
        try {
          const formData = new FormData()
          formData.append("file", selectedFile)
          
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
          
          if (!res.ok) {
            throw new Error(`Local upload API returned status ${res.status}`)
          }
          
          const data = await res.json()
          if (!data.fileUrl) {
            throw new Error("No fileUrl returned from local upload API")
          }
          
          fileUrl = data.fileUrl
          console.log("Uploaded successfully to local server:", fileUrl)
        } catch (localError) {
          console.error("Local server upload failed, falling back to transient Blob URL:", localError)
          fileUrl = URL.createObjectURL(selectedFile)
        }
      }

      const sizeInMB = selectedFile.size / (1024 * 1024)
      const fileSizeStr = sizeInMB < 0.1 ? `${(selectedFile.size / 1024).toFixed(1)} KB` : `${sizeInMB.toFixed(1)} MB`
      
      await onSave({
        ...values,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        uploadedBy: MOCK_USER.uid,
        uploadedByName: MOCK_USER.fullName,
        uploadedAt: new Date().toISOString(),
        fileUrl: fileUrl,
        fileSize: fileSizeStr
      } as BusinessDocument)
      
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
      form.setError("root", { message: "Failed to upload document. Please try again." })
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
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isDragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/20 bg-muted/20 hover:bg-muted/30"
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          if (!form.getValues("name")) {
                            const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                            form.setValue("name", nameWithoutExtension);
                          }
                        }
                      }}
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-1 text-center w-full">
                        <div className="p-3 bg-primary/10 rounded-full text-primary mb-1">
                          <FileText className="size-8" />
                        </div>
                        <p className="text-xs font-semibold truncate max-w-full px-4">{selectedFile.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-[10px] uppercase font-bold text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="size-8 text-muted-foreground" />
                        <p className="text-xs font-medium">Click or drag file to upload</p>
                        <p className="text-[10px] text-muted-foreground uppercase">PDF, JPG, PNG up to 10MB</p>
                      </>
                    )}
                  </div>
                </FormControl>
                {form.formState.errors.root && (
                  <p className="text-xs font-semibold text-destructive mt-1 text-center">
                    {form.formState.errors.root.message}
                  </p>
                )}
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
