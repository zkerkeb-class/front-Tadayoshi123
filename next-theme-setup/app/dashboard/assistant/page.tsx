"use client"

import { useState, useRef, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { sendChatMessage, clearChatMessages, addMockChatMessage } from "@/lib/store/slices/aiSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Server,
  BarChart3,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { toast } from "react-toastify"

export default function AIAssistantPage() {
  const dispatch = useAppDispatch()
  const { chatMessages, isChatLoading, chatError } = useAppSelector((state) => state.ai)
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 1024px)")

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Sample conversation starters
  const conversationStarters = [
    {
      icon: Server,
      title: "Server Status",
      message: "Show me the current status of all servers",
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      message: "What are the current CPU and memory usage trends?",
    },
    {
      icon: AlertTriangle,
      title: "Active Alerts",
      message: "List all active alerts and their severity levels",
    },
    {
      icon: Clock,
      title: "Recent Issues",
      message: "What infrastructure issues occurred in the last 24 hours?",
    },
  ]

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message
    if (!textToSend.trim()) return

    setMessage("")

    try {
      // Utilisation du service IA réel avec le bon format d'appel
      await dispatch(sendChatMessage({ 
        prompt: textToSend, 
        context: {
          type: "ops-assistant",
          source: "dashboard-page"
        } 
      })).unwrap()
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to send message. Please try again.")
    }
  }

  // Generate mock responses for demo
  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("server") || lowerMessage.includes("status")) {
      return `I can see you're asking about server status. Here's what I found:

🟢 **web-server-01**: Healthy (CPU: 45%, Memory: 62%)
🟢 **web-server-02**: Healthy (CPU: 38%, Memory: 58%)
🟡 **db-primary**: Warning (CPU: 78%, Memory: 85%)
🔴 **cache-server**: Critical (CPU: 92%, Memory: 95%)

The cache-server needs immediate attention. Would you like me to show you detailed metrics or suggest optimization steps?`
    }

    if (lowerMessage.includes("alert") || lowerMessage.includes("issue")) {
      return `Here are the current active alerts:

🔴 **Critical (2)**:
- High CPU usage on cache-server (92%)
- Database connection pool exhausted

🟡 **Warning (3)**:
- Disk space low on storage-node-03 (85% full)
- Memory usage high on db-primary (85%)
- Response time degradation on API gateway

Would you like me to provide resolution steps for any of these alerts?`
    }

    if (lowerMessage.includes("performance") || lowerMessage.includes("metric")) {
      return `Here's a summary of your infrastructure performance:

📊 **Key Metrics (Last 1 Hour)**:
- Average CPU Usage: 65% (↑ 8% from previous hour)
- Average Memory Usage: 72% (↑ 5% from previous hour)
- Average Response Time: 145ms (↓ 12ms improvement)
- Error Rate: 0.02% (↓ 0.01% improvement)

**Trends**: CPU usage is trending upward. I recommend investigating the cache-server performance issues.

Would you like me to create a detailed performance report or suggest optimization strategies?`
    }

    return `I understand you're asking about "${userMessage}". As your AI infrastructure assistant, I can help you with:

• **Server monitoring** - Check status, performance, and health
• **Alert management** - Review active alerts and get resolution steps  
• **Performance analysis** - Analyze metrics and identify bottlenecks
• **Troubleshooting** - Get step-by-step guidance for common issues
• **Optimization** - Receive recommendations for better performance

What specific aspect would you like me to help you with?`
  }

  const handleClearChat = () => {
    dispatch(clearChatMessages())
    toast.success("Chat history cleared")
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Message copied to clipboard")
  }

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
            <MessageSquare className="mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            AI Operations Assistant
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Get intelligent insights and assistance for your infrastructure monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="secondary" className="flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            GPT-4o-mini
          </Badge>
          {chatMessages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearChat}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Chat
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Conversation Starters Sidebar - Shown on larger screens or as horizontal scrollable on mobile */}
        {isSmallScreen ? (
          <div className="lg:hidden overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {conversationStarters.map((starter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex-shrink-0 h-auto p-3"
                  onClick={() => handleSendMessage(starter.message)}
                >
                  <div className="flex items-start space-x-2">
                    <starter.icon className="h-4 w-4 mt-0.5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{starter.title}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden lg:block lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Start a conversation with these common queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {conversationStarters.map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleSendMessage(starter.message)}
                  >
                    <div className="flex items-start space-x-3">
                      <starter.icon className="h-4 w-4 mt-0.5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{starter.title}</div>
                        <div className="text-xs text-muted-foreground">{starter.message}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-13rem)] md:h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-1" />
                  Online
                </Badge>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 px-3 md:px-4 h-[calc(100%-4rem)]">
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-8 md:py-12">
                      <Bot className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Welcome to AI Assistant</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">
                        I'm here to help you monitor and manage your infrastructure. Ask me about server status,
                        performance metrics, alerts, or any operational questions.
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span>Try asking: "Show me server status"</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 w-full">
                    {chatMessages.filter(msg => msg && typeof msg === 'object' && msg.role).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 md:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
                      >
                        {msg.role === "assistant" && (
                          <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="h-3 w-3 md:h-4 md:w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`max-w-[80%] md:max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                          <div
                            className={`rounded-lg px-3 py-2 md:px-4 md:py-2 break-words ${
                              msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-muted"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm overflow-wrap-anywhere">{msg.content}</div>
                          </div>

                          <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                            {msg.role === "assistant" && (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => copyMessage(msg.content)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {msg.role === "user" && (
                          <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                            <AvatarFallback className="bg-gray-100">
                              <User className="h-3 w-3 md:h-4 md:w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="h-3 w-3 md:h-4 md:w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2 md:px-4 md:py-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-3 md:p-4 mt-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isMobile ? "Ask a question..." : "Ask about server status, metrics, alerts, or any infrastructure question..."}
                    disabled={isChatLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isChatLoading || !message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mt-2 text-xs text-muted-foreground">
                  <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
                  <span>Powered by AI • Responses may take a few seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
