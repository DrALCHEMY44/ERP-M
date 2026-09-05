
"use client"

import * as React from "react"
import { Send, Bot, User, ShieldAlert, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { canAccessRoute } from "@/lib/client-access"
import { useAuth } from "@/hooks/use-auth"
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
    purpose: "assistant" | "dashboard"
    cached: boolean
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
          content: `Hello ${firstName}. What would you like to understand about your business? Ask a question below or choose a starting point above.`,
        },
      ])
    }
  }, [profile, messages.length])

  const handleSend = async (question = input) => {
    if (!question.trim() || isLoading || !profile) return
    const userMsg = question.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setIsLoading(true)

    try {
      // Call our secure server-side API route
      if (!user) throw new Error('Your session has expired. Please sign in again.')
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryText: userMsg,
          purpose: "assistant",
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
            "The assistant could not connect. Please check your connection and try again.",
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
    <div className="mx-auto flex min-h-[600px] w-full max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-9rem)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Your business assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Turn your business records into answers and practical next steps.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Suggested questions">
        {[
          { route: '/sales', title: 'Sales performance', question: 'Summarize my sales this month and identify the strongest products.' },
          { route: '/inventory', title: 'Stock to watch', question: 'Which products are low on stock and should I restock first?' },
          { route: '/expenses', title: 'Understand spending', question: 'Break down my expenses this month by category.' },
          { route: '/tasks', title: 'Team priorities', question: 'Which tasks are overdue or need attention today?' },
        ].filter(item => canAccessRoute(item.route, profile.role)).map(item => (
          <button key={item.route} type="button" disabled={isLoading} onClick={() => void handleSend(item.question)} className="rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50">
            <span className="block text-sm font-semibold">{item.title}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.question}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-card border rounded-xl flex flex-col overflow-hidden min-h-0">
        <ScrollArea className="min-h-[260px] flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-lg border flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-muted-foreground" aria-label="Assistant" />
                  </div>
                )}
                <div className={`min-w-0 max-w-[85%] break-words rounded-xl px-4 py-3 text-sm leading-7 ${
                  msg.role === 'assistant'
                    ? 'bg-muted/60 text-foreground'
                    : 'bg-primary text-primary-foreground rounded-tr-none'
                }`}>
                  <AIResponseRenderer content={msg.content} role={msg.role} />
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 border">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div role="status" className="flex gap-3 items-center text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Reviewing your business records…
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/20">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Textarea
              aria-label="Your question"
              placeholder="Ask a question about your business…"
              value={input}
              maxLength={2000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault(); void handleSend();
                }
              }}
              className="min-h-14 max-h-40 resize-y rounded-xl bg-background px-4 py-3"
            />
            <Button size="icon" className="shrink-0 h-14 w-12" disabled={isLoading || !input.trim()} aria-label="Send message">
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
             <p>Answers use records available to your role. Verify important figures.</p>
             <p>Enter to send · Shift + Enter for a new line</p>
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
            className={`font-semibold ${role === 'user' ? 'text-white' : 'text-foreground'}`}
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
