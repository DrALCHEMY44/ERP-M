
"use client"

import * as React from "react"
import { Send, Bot, User, Sparkles, ShieldAlert, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { logActivity } from "@/lib/audit-logger"
import Link from "next/link"

interface Message {
  role: "assistant" | "user"
  content: string
}

interface AIQueryResponse {
  response: string
  metadata?: {
    model: string
    role: string
    processingTimeMs: number
    contextModules: string[]
  }
  error?: string
}

export default function AIAssistantPage() {
  const { user, profile, loading: authLoading } = useAuth()

  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Set the initial greeting once the profile is loaded
  React.useEffect(() => {
    if (profile && messages.length === 0) {
      const firstName = profile.fullName?.split(' ')[0] || 'there'
      setMessages([
        {
          role: "assistant",
          content: `Hello ${firstName}! I am your SmartERP AI assistant. I can analyze your sales, inventory, tasks, and more based on your role as **${profile.role}**. How can I help you today?`,
        },
      ])
    }
  }, [profile, messages.length])

  const handleSend = async () => {
    if (!input.trim() || isLoading || !profile) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      // Log the user's AI query for the audit trail
      await logActivity({
        actionType: 'AI_QUERY',
        module: 'AI Assistant',
        description: `User asked AI: "${userMsg.substring(0, 50)}${userMsg.length > 50 ? '...' : ''}"`,
        userProfile: {
          tenantId: profile.tenantId,
          businessId: profile.businessId,
          uid: profile.id,
          fullName: profile.fullName,
          role: profile.role,
        },
      })

      // Call our secure server-side API route
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText: userMsg,
          tenantId: profile.tenantId,
          businessId: profile.businessId,
          userId: profile.id,
          role: profile.role,
          userName: profile.fullName || profile.email,
        }),
      })

      const data: AIQueryResponse = await response.json()

      if (!response.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "I'm sorry, something went wrong. Please try again.",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      }
    } catch (error) {
      console.error('AI Assistant error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error connecting to the intelligence engine. Please check your connection and try again.",
        },
      ])
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

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated
  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] gap-4">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Authentication Required</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          You must be signed in to use the AI Business Intelligence assistant.
          Your data access is determined by your role and tenant.
        </p>
        <Button asChild>
          <Link href="/login">
            <LogIn className="size-4 mr-2" />
            Sign In
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          AI Business Intelligence
        </h1>
        <p className="text-xs text-muted-foreground">
          Context-aware assistant for your Cameroonian SME • Role: <span className="font-semibold text-foreground">{profile.role}</span>
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20 py-3">
        <ShieldAlert className="size-4 text-primary" />
        <AlertTitle className="text-primary text-xs font-bold uppercase tracking-widest">Security Protocol Active</AlertTitle>
        <AlertDescription className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
          Read-Only Assistant • Multi-Tenant Isolated • Permission Aware • Powered by Gemma 4
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
                  <AIResponseRenderer content={msg.content} role={msg.role} />
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
              placeholder="Ask me: 'What are my total sales?' or 'Show low stock items'..." 
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
               Tenant: {profile.tenantId}
             </p>
             <p className="text-[8px] text-primary uppercase tracking-widest font-bold">
               Immutable Log Protocol
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIResponseRenderer({ content, role }: { content: string; role: 'assistant' | 'user' }) {
  // Parse bold and italics markdown inline
  const parseMarkdown = (text: string) => {
    // Splitting by **bold** first
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((boldPart, i) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        const innerText = boldPart.slice(2, -2);
        return (
          <strong 
            key={`b-${i}`} 
            className={`font-bold ${role === 'user' ? 'text-white' : 'text-primary'}`}
          >
            {innerText}
          </strong>
        );
      }
      
      // Split by *italics*
      const italicParts = boldPart.split(/(\*.*?\*)/g);
      return italicParts.map((italicPart, j) => {
        if (italicPart.startsWith('*') && italicPart.endsWith('*')) {
          const innerItalicText = italicPart.slice(1, -1);
          return (
            <em 
              key={`i-${j}`} 
              className={`italic ${role === 'user' ? 'text-white/90' : 'text-muted-foreground text-xs'}`}
            >
              {innerItalicText}
            </em>
          );
        }
        return italicPart;
      });
    });
  };

  // Split content by newline to preserve paragraph separation
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => (
        <p key={index} className="leading-relaxed">
          {parseMarkdown(line)}
        </p>
      ))}
    </div>
  );
}

