"use client"

import { useState } from "react"
import { Sparkles, Send, Bot, User, Lock, AlertTriangle, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MOCK_USER } from "@/lib/mock-data"

type Message = {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello Jean-Pierre. I am your KoboCore AI Assistant. I have read-only access to Superette de l'Avenir's data for tenant Douala. How can I help you today? I can summarize your sales, check inventory, or review task performance.",
      timestamp: new Date()
    }
  ])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Simulate AI thinking and response
    setTimeout(() => {
      let aiContent = ""
      const query = input.toLowerCase()

      if (query.includes("delete") || query.includes("edit") || query.includes("change")) {
        aiContent = "I can summarize and report on business information, but I cannot modify records. I am a read-only assistant."
      } else if (query.includes("salary") || query.includes("payroll")) {
         // Even though user is owner, showing RBAC logic simulation
         aiContent = "As a Business Owner, you have access to salary data. Total payroll for this month is 1,250,000 FCFA. I can only answer based on the data available in your business account and your permission level."
      } else {
        aiContent = "I've analyzed your current business state. Sales today reached 150,000 FCFA. You have 2 overdue tasks that were due yesterday. Your stock of 'Savon Azur' is high, but 'Riz Long Grain' is critical. I can only answer based on the data available in your business account and your permission level."
      }

      const aiMsg: Message = { role: 'assistant', content: aiContent, timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])
    }, 1000)
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
              Role: {MOCK_USER.role}
           </Badge>
           <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-secondary">
              <Lock className="size-3.5" />
              Read-Only Mode
           </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-3 flex flex-col min-h-0 border-accent/20">
          <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-accent" />
              <CardTitle className="text-base">KoboCore Smart Intelligence</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-bold">GPT-4o Backend</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
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
                       <span className="text-[10px] text-muted-foreground px-1">
                         {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full items-center gap-3"
            >
              <Input 
                placeholder="Ask about sales, tasks, or inventory..." 
                className="flex-1 focus-visible:ring-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
                <Send className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Safety & Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                <p>The AI cannot modify records or perform actions like approvals.</p>
              </div>
              <div className="flex gap-2">
                <Lock className="size-4 text-blue-500 shrink-0" />
                <p>Data is strictly isolated to your tenant ID: {MOCK_USER.tenantId}.</p>
              </div>
              <div className="p-3 bg-muted rounded-md italic">
                "I can only answer based on the data available in your business account and your permission level."
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader className="pb-3">
                <CardTitle className="text-sm">Suggested Questions</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col gap-2">
                {[
                  "What were total sales today?",
                  "Which products are low in stock?",
                  "Show overdue tasks by employee",
                  "Monthly performance summary"
                ].map((q, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className="justify-start text-xs font-normal h-auto py-2 px-3 hover:bg-accent/10 hover:text-accent"
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </Button>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
