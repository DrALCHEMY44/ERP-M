"use client"

import * as React from "react"
import { Send, Bot, User, Sparkles, ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { masterAssistant } from "@/ai/flows/master-assistant-flow"
import { MOCK_USER } from "@/lib/mock-data"

interface Message {
  role: "assistant" | "user"
  content: string
}

export default function AIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "assistant", content: `Hello ${MOCK_USER.fullName.split(' ')[0]}! I am your SmartERP AI assistant. I can analyze your sales, inventory, and tasks for ${MOCK_USER.tenantId}. How can I help you today?` }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      const response = await masterAssistant({
        query: userMsg,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        userId: MOCK_USER.uid,
        userRole: MOCK_USER.role,
        permissions: MOCK_USER.permissions,
      })
      setMessages(prev => [...prev, { role: "assistant", content: response.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error connecting to the intelligence engine. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          AI Business Intelligence
        </h1>
        <p className="text-xs text-muted-foreground">Context-aware assistant for your Cameroonian SME.</p>
      </div>

      <Alert className="bg-primary/5 border-primary/20 py-3">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-primary text-xs font-bold uppercase tracking-widest">Security Protocol Active</AlertTitle>
        <AlertDescription className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
          Read-Only Assistant • Multi-Tenant Isolated • Permission Aware
        </AlertDescription>
      </Alert>

      <div className="flex-1 bg-card border rounded-2xl shadow-lg flex flex-col overflow-hidden min-h-0">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="size-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-muted text-foreground rounded-tl-none' 
                    : 'bg-primary text-primary-foreground rounded-tr-none'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 border shadow-sm">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start items-center animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0" />
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Ask me: 'What are my total sales today?' or 'Show me overdue tasks'..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-background rounded-full px-6 shadow-inner h-12 border-primary/20 focus-visible:ring-primary"
            />
            <Button size="icon" className="rounded-full shrink-0 shadow-lg h-12 w-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-3">
             <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">
               Secure Data Sync: Douala_001
             </p>
             <p className="text-[8px] text-primary uppercase tracking-widest font-bold">
               OHADA Compliant Engine
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
