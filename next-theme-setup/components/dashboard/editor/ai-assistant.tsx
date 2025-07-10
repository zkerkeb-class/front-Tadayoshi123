"use client";

import React, { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { sendChatMessage, generateDashboard, setCurrentPrompt } from "@/lib/store/slices/aiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Bot, User, Send, Sparkles, Loader2, MessageSquare, Wand2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dashboard, DashboardBlock } from "@/lib/types/dashboard";
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  onClose: () => void;
  dashboard: Dashboard;
  onApplyBlocks: (blocks: DashboardBlock[]) => void;
}

export function AIAssistant({ onClose, dashboard, onApplyBlocks }: AIAssistantProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    chatMessages,
    isChatLoading,
    chatError,
    generatedDashboard,
    isDashboardLoading,
    dashboardError,
    currentPrompt,
  } = useAppSelector((state) => state.ai);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch(setCurrentPrompt(e.target.value));
  };

  const handleSendMessage = () => {
    if (!currentPrompt.trim()) return;
    const dashboardContext = {
      title: dashboard.title,
      blockCount: dashboard.blocks.length,
      blockTypes: dashboard.blocks.map(b => b.type)
    };
    
    dispatch(sendChatMessage({ prompt: currentPrompt, context: dashboardContext }))
      .unwrap()
      .then(() => {
        dispatch(setCurrentPrompt(""));
      })
      .catch((error) => {
      toast({
          title: "Erreur d'envoi",
          description: error || "Impossible d'envoyer le message à l'assistant IA.",
          variant: "destructive",
        });
      });
  };

  const handleGenerateDashboard = () => {
    if (!currentPrompt.trim() || isDashboardLoading) return;

    const dashboardContext = {
      existingBlocks: dashboard.blocks.map(b => ({ id: b.id, type: b.type, title: b.title })),
      dashboardTitle: dashboard.title,
      preferredMetrics: ["cpu_usage", "memory_usage"],
    };

    dispatch(generateDashboard({ prompt: currentPrompt, context: dashboardContext }))
      .unwrap()
      .then((result) => {
        if (result && result.dashboard && result.dashboard.blocks) {
          onApplyBlocks(result.dashboard.blocks);
          toast({
            title: "Génération terminée",
            description: `${result.dashboard.blocks.length} blocs ont été ajoutés à votre dashboard.`,
          });
          dispatch(setCurrentPrompt(""));
        } else {
          toast({
            title: "Réponse inattendue",
            description: "L'IA n'a pas retourné de blocs valides.",
            variant: "warning",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erreur de génération",
          description: typeof error === 'string' ? error : "Impossible de générer les blocs.",
          variant: "destructive",
        });
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent, mode: 'chat' | 'generate') => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'chat') {
        handleSendMessage();
      } else {
        handleGenerateDashboard();
      }
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 grid w-full grid-cols-2">
          <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
            Chat
            </TabsTrigger>
          <TabsTrigger value="generate">
              <Wand2 className="h-4 w-4 mr-2" />
            Generate
            </TabsTrigger>
          </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden p-0 m-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                   <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50"/>
                   <p>Posez-moi une question sur votre dashboard.</p>
                 </div>
              )}
              {chatMessages.filter(msg => msg && typeof msg === 'object' && msg.role).map((msg) => (
                <div key={msg.id} className={cn("flex items-end gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%] text-sm break-words",
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {msg.content}
                  </div>
                   {msg.role === "user" && (
                     <Avatar className="h-8 w-8">
                       <AvatarFallback>
                         <User className="h-4 w-4" />
                       </AvatarFallback>
                     </Avatar>
                   )}
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
               {chatError && (
                 <div className="text-destructive text-xs flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                   <AlertCircle className="h-4 w-4" /> {chatError}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="relative">
              <Textarea
                placeholder="Ask me anything about your dashboard..."
                className="pr-16"
                rows={2}
                value={currentPrompt}
                onChange={handlePromptChange}
                onKeyDown={(e) => handleKeyPress(e, 'chat')}
                disabled={isChatLoading}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isChatLoading || !currentPrompt.trim()}
              >
                  <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
                Describe the blocks you want to add to your dashboard. For example: "Add a line chart for CPU usage and a table for active alerts".
            </p>
                <Textarea
              placeholder="Generate a line chart for CPU and a gauge for memory..."
              className="flex-1 resize-none"
              value={currentPrompt}
              onChange={handlePromptChange}
              onKeyDown={(e) => handleKeyPress(e, 'generate')}
              disabled={isDashboardLoading}
            />
            <Button
              onClick={handleGenerateDashboard}
              disabled={isDashboardLoading || !currentPrompt.trim()}
            >
              {isDashboardLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate & Add Blocks
            </Button>
            {dashboardError && (
              <div className="text-destructive text-xs flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                <AlertCircle className="h-4 w-4" /> {dashboardError}
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 