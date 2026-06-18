
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-data"
import { History, User, Clock, FileText } from "lucide-react"

export default function ActivityLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-headline">Journaux d'Activité</h2>
        <p className="text-sm text-muted-foreground">Audit complet des actions effectuées par les utilisateurs (Tenant Douala).</p>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6 border-b">
          <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
            <History className="size-5 text-muted-foreground" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-[10px] uppercase tracking-wider whitespace-nowrap">
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date & Heure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ACTIVITY_LOGS.map((log) => (
                  <TableRow key={log.id} className="whitespace-nowrap text-xs">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold flex items-center gap-1">
                          <User className="size-3" /> {log.userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">{log.userRole}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary/50 font-bold text-[10px]">
                        {log.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <FileText className="size-3 text-muted-foreground" /> {log.module}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {log.description}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3" /> {new Date(log.timestamp).toLocaleString('fr-CM')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
