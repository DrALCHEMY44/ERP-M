"use client"

import * as React from "react"
import { Send, Bot, User, Sparkles, ShieldAlert } from "lucide-react"
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
    { role: "assistant", content: "Hello Jean-Pierre! I am your SmartERP AI assistant. How can I help you manage your business in Douala today?" }
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
      setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          AI Business Assistant
        </h1>
        <p className="text-xs text-muted-foreground">Ask me about your sales, inventory, tasks, or financial health.</p>
      </div>

      <Alert className="bg-primary/5 border-primary/20 py-2 px-3">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-primary text-xs font-bold uppercase tracking-tighter">Read-Only Assistant</AlertTitle>
        <AlertDescription className="text-[10px]">
          I can analyze and report on your data, but I cannot modify records or change settings.
        </AlertDescription>
      </Alert>

      <div className="flex-1 bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-0">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="size-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-muted text-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border shadow-sm">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0" />
                <div className="h-10 w-32 bg-muted rounded-2xl" />
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
              placeholder="e.g., Show me high priority tasks for this week..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-background rounded-full px-6 shadow-inner"
            />
            <Button size="icon" className="rounded-full shrink-0 shadow-lg" disabled={isLoading}>
              <Send className="size-4" />
            </Button>
          </form>
          <p className="text-[8px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-bold">
            Secure Cameroonian SME Intelligence • OHADA Compliant
          </p>
        </div>
      </div>
    </div>
  )
}
