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
    { role: "assistant", content: "Hello Jean-Pierre! I am your SmartERP AI assistant. How can I help you today?" }
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
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error. Please try again." }])
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
          AI Assistant
        </h1>
      </div>

      <Alert className="bg-primary/5 border-primary/20 py-2 px-3">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-primary text-xs font-bold">Read-Only</AlertTitle>
        <AlertDescription className="text-[10px]">
          I can analyze your data but cannot modify records.
        </AlertDescription>
      </Alert>

      <div className="flex-1 bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'assistant' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-background rounded-full"
            />
            <Button size="icon" className="rounded-full shrink-0" disabled={isLoading}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
