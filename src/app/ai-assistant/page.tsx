"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, User, Lock, AlertTriangle, ShieldCheck, Loader2, Send } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MOCK_USER } from "@/lib/mock-data"
import { masterAssistant } from "@/ai/flows/master-assistant-flow"

type Message = {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${MOCK_USER.fullName.split(' ')[0]}. I am your SmartERP AI Assistant. I have read-only access to ${MOCK_USER.tenantId}'s data. How can I help you today?`,
      timestamp: new Date()
    }
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const result = await masterAssistant({
        query: currentInput,
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        userId: MOCK_USER.uid,
        userRole: MOCK_USER.role,
        permissions: MOCK_USER.permissions,
      })

      const aiMsg: Message = { 
        role: 'assistant', 
        content: result.response, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const errorMsg: Message = { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error while processing your request. Please try again.", 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
          <p className="text-muted-foreground">Context-aware business intelligence at your fingertips.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-accent/10 border-accent/30 text-accent">
              <ShieldCheck className="size-3.5" />
              {MOCK_USER.role}
           </Badge>
           <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-secondary">
              <Lock className="size-3.5" />
              Read-Only
           </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-3 flex flex-col min-h-0 border-accent/20">
          <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-accent" />
              <CardTitle className="text-base font-headline">SmartERP Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4" viewportRef={scrollRef}>
              <div className="flex flex-col gap-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant' ? 'bg-accent text-white' : 'bg-primary text-white'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="size-5" /> : <User className="size-5" />}
                    </div>
                    <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                       <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                         msg.role === 'assistant' 
                          ? 'bg-accent/5 border border-accent/10 text-foreground' 
                          : 'bg-primary text-white'
                       }`}>
                         {msg.content}
                       </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-accent text-white flex items-center justify-center shrink-0">
                      <Bot className="size-5" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-accent/5 rounded-2xl border border-accent/10">
                      <Loader2 className="size-4 animate-spin text-accent" />
                      <span className="text-xs text-muted-foreground italic">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center gap-3">
              <Input 
                placeholder="Ask about sales, tasks, or inventory..." 
                className="flex-1 focus-visible:ring-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-headline">Safety & Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                <p>The AI cannot modify records or perform actions like approvals.</p>
              </div>
              <div className="flex gap-2">
                <Lock className="size-4 text-blue-500 shrink-0" />
                <p>Data is strictly isolated to your tenant ID.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
