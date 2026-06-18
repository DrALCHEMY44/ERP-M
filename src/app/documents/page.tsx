
"use client"

import * as React from "react"
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Filter, 
  FileCheck, 
  ShieldCheck,
  MoreVertical,
  Loader2,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFirestore } from "@/hooks/use-firestore"
import { BusinessDocument, DocumentType } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"
import { useToast } from "@/hooks/use-toast"
import { DocumentDialog } from "@/components/documents/document-dialog"

export default function DocumentsPage() {
  const { data: documents, loading, addRecord, deleteRecord } = useFirestore<BusinessDocument>('documents');
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<DocumentType | 'All'>('All')

  const isAuthorized = hasPermission(MOCK_USER.role, 'viewDocuments');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || doc.type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const handleSave = async (docData: Partial<BusinessDocument>) => {
    try {
      await addRecord(docData as Omit<BusinessDocument, 'id'>);
      toast({ title: "Document Saved", description: "File reference added to secure cloud directory." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to index document." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this document from the vault?")) {
      try {
        await deleteRecord(id);
        toast({ title: "Document Removed", description: "Reference deleted from cloud storage." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete record." });
      }
    }
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center p-4">
        <div className="bg-muted p-6 rounded-full">
          <Lock className="size-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Secure Vault Restricted</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          You do not have the required security clearance to view business documents. Contact your SME Administrator.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Document Management</h1>
          <p className="text-sm text-muted-foreground">Secure multi-tenant vault for business records and compliance files.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-primary shadow-sm bg-primary/5">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Vault Files</CardDescription>
            <CardTitle className="text-2xl font-bold">{documents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-sm bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Compliance Status</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">Audit Ready</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-blue-500 shadow-sm bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Storage Used</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">{(documents.length * 1.5).toFixed(1)} MB</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by filename or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest">
                  <Filter className="size-3.5 mr-2" /> Filter: {selectedType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedType('All')}>All Types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('Invoice')}>Invoices</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('License')}>Licenses</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('Contract')}>Contracts</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('Report')}>Reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <Card key={doc.id} className="group hover:border-primary/50 transition-all shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border">
                      <FileText className="size-6" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-[10px] font-bold uppercase cursor-pointer">
                          <Download className="size-3 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-[10px] font-bold uppercase text-destructive cursor-pointer"
                          onClick={() => handleDelete(doc.id!)}
                        >
                          <Trash2 className="size-3 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm truncate" title={doc.name}>{doc.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[8px] uppercase font-bold tracking-tighter h-4">
                        {doc.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{doc.fileSize}</span>
                    </div>
                    {doc.description && (
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-2">{doc.description}</p>
                    )}
                  </div>
                </div>
                <div className="bg-muted/30 px-4 py-2 border-t flex items-center justify-between mt-auto">
                   <div className="flex flex-col">
                     <span className="text-[8px] uppercase font-bold text-muted-foreground">Uploaded By</span>
                     <span className="text-[9px] font-medium">{doc.uploadedByName}</span>
                   </div>
                   <span className="text-[8px] font-mono text-muted-foreground">
                     {new Date(doc.uploadedAt).toLocaleDateString()}
                   </span>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center space-y-3">
              <FileCheck className="size-12 text-muted-foreground/30" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground">No documents found</p>
                <p className="text-xs text-muted-foreground italic">Start by uploading your first business record.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-4">
          <ShieldCheck className="size-8 text-emerald-600 opacity-50" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight text-emerald-700">Encryption Active</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">All files are encrypted at rest with AES-256.</p>
          </div>
        </div>
        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-4">
          <FileCheck className="size-8 text-blue-600 opacity-50" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight text-blue-700">SYCOHADA Ready</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Compliant with OHADA digital archive standards.</p>
          </div>
        </div>
      </div>

      <DocumentDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
