"use client"

import type React from "react"

import { useState, useCallback, useEffect, memo } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DashboardLayout, DashboardBlock } from "@/lib/types/dashboard"
import { ModuleLibrary } from "./module-library"
import { DashboardGrid } from "./dashboard-grid"
import { BlockConfigPanel } from "./block-config-panel"
import { TemplateSelector } from "./template-selector"
import { Save, Edit3, Plus, Settings, Palette, Download, Upload, Grid3X3, Bot, Sparkles, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch } from "@/lib/store/hooks"
import { generateDashboard, sendChatMessage } from "@/lib/store/slices/aiSlice"
import { getBlockTemplate } from "@/lib/dashboard/block-templates"
import { metricsService } from "@/lib/services/metrics.service"

interface DashboardEditorProps {
  dashboard?: DashboardLayout
  onSave?: (dashboard: DashboardLayout) => Promise<void>
  onAutoSave?: (dashboard: DashboardLayout) => Promise<void>
  initialViewMode?: boolean
}

// Mémoiser le composant DashboardGrid pour éviter les re-renders inutiles
const MemoizedDashboardGrid = memo(DashboardGrid);

export function DashboardEditor({ dashboard, onSave, onAutoSave, initialViewMode = false }: DashboardEditorProps) {
  const [currentDashboard, setCurrentDashboard] = useState<DashboardLayout>(
    dashboard || {
      id: `dashboard-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      title: "New Dashboard",
      description: "",
      tags: [],
      blocks: [],
      time: {
        from: "now-6h",
        to: "now",
        raw: { from: "now-6h", to: "now" }
      },
      timepicker: {
        refresh_intervals: ["5s", "10s", "30s", "1m", "5m", "15m", "30m", "1h", "2h", "1d"],
        time_options: ["5m", "15m", "1h", "6h", "12h", "24h", "2d", "7d", "30d"]
      },
      timezone: "browser",
      refresh: "30s",
      schemaVersion: 16,
      version: 1,
      settings: {
        columns: 12,
        gap: 16,
        autoSave: true,
        theme: "auto",
        refreshInterval: 30000,
        editable: true,
        hideControls: false,
        graphTooltip: "default"
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "user",
        version: 1,
        tags: [],
        isTemplate: false,
        isPublic: false,
      },
      name: "New Dashboard",
    },
  )

  const [isEditMode, setIsEditMode] = useState(!initialViewMode)
  const [selectedBlock, setSelectedBlock] = useState<DashboardBlock | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // AI Assistant state
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant", content: string }>>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const dispatch = useAppDispatch()

  // Configuration des capteurs avec des seuils adaptés pour éviter les déclenchements accidentels
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Augmenté pour éviter les déclenchements accidentels
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  // Auto-save functionality
  useEffect(() => {
    if (isEditMode && currentDashboard.settings.autoSave && onAutoSave) {
      const autoSaveTimer = setTimeout(() => {
        onAutoSave(currentDashboard).catch(console.warn)
      }, 2000)

      return () => clearTimeout(autoSaveTimer)
    }
  }, [currentDashboard, isEditMode, onAutoSave])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setIsDragging(true)
  }, [])

  // Fonction optimisée pour ajouter un bloc depuis un template
  const addBlockFromTemplate = useCallback((templateId: string, position?: { x: number; y: number }) => {
    const template = getBlockTemplate(templateId)
    if (!template) {
      toast({
        title: "Erreur",
        description: "Template de bloc introuvable",
        variant: "destructive",
      })
      return
    }
    
    // Créer le nouveau bloc avec une position calculée
    const newBlock: DashboardBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: templateId,
      title: template.name,
      description: template.description || "",
      position: {
        x: position?.x || 0,
        y: position?.y || Math.max(...currentDashboard.blocks.map(b => b.position.y + b.position.h), 0),
        w: template.defaultSize?.w || 6,
        h: template.defaultSize?.h || 4
      },
      config: template.defaultConfig || {},
      style: {},
      datasource: undefined,
      targets: []
    }
    
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
        version: prev.metadata.version + 1,
      }
    }))
    
    toast({
      title: "Bloc ajouté",
      description: `${template.name} a été ajouté au dashboard`,
    })
  }, [currentDashboard.blocks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setIsDragging(false)
    setActiveId(null)

    if (!over) return

    // Si l'élément est un template de bloc (depuis la bibliothèque)
    if (active.id.toString().startsWith("block-template-")) {
      const templateId = active.id.toString().replace("block-template-", "")
      
      // Calculer la position approximative où le bloc a été déposé
      // Utiliser les coordonnées de la souris pour déterminer la position
      const position = {
        x: Math.floor((event.activatorEvent as MouseEvent).clientX / 100) * 2, // Estimation de la position X
        y: Math.max(...currentDashboard.blocks.map(b => b.position.y + b.position.h), 0)
      }
      
      addBlockFromTemplate(templateId, position)
      return
    }

    // Si on déplace un bloc existant
    if (active.id !== over.id) {
      setCurrentDashboard((prev) => {
        const oldIndex = prev.blocks.findIndex(block => block.id === active.id)
        const newIndex = prev.blocks.findIndex(block => block.id === over.id)
        
        if (oldIndex !== -1 && newIndex !== -1) {
          // Réorganiser l'ordre des blocs
          const newBlocks = arrayMove(prev.blocks, oldIndex, newIndex)
          
          // Recalculer les positions Y pour éviter les chevauchements
          let currentY = 0
          const updatedBlocks = newBlocks.map((block) => {
            // Conserver la position X mais ajuster la position Y
            const updatedBlock = {
              ...block,
              position: {
                ...block.position,
                y: currentY
              }
            }
            currentY += block.position.h + 1 // +1 pour l'espacement
            return updatedBlock
          })
          
          return {
            ...prev,
            blocks: updatedBlocks,
            metadata: {
              ...prev.metadata,
              updatedAt: new Date().toISOString(),
              version: prev.metadata.version + 1,
            }
          }
        }
        
        return prev
      })
    } else {
      // Si le bloc est déplacé sur lui-même, mettre à jour sa position
      // Cela permet de repositionner un bloc sans changer son ordre
      const blockId = active.id.toString()
      const blockIndex = currentDashboard.blocks.findIndex(b => b.id === blockId)
      
      if (blockIndex !== -1) {
        // Mise à jour de la position du bloc
        const updatedBlocks = [...currentDashboard.blocks]
        
        // Ajuster la position Y pour éviter les chevauchements
        let newY = updatedBlocks[blockIndex].position.y
        
        // Vérifier s'il y a des blocs qui se chevauchent
        const blockToUpdate = updatedBlocks[blockIndex]
        updatedBlocks.forEach((otherBlock, idx) => {
          if (idx !== blockIndex && 
              blockToUpdate.position.y >= otherBlock.position.y && 
              blockToUpdate.position.y < otherBlock.position.y + otherBlock.position.h) {
            // Déplacer le bloc en dessous du bloc avec lequel il se chevauche
            newY = otherBlock.position.y + otherBlock.position.h + 1
          }
        })
        
        updatedBlocks[blockIndex] = {
          ...updatedBlocks[blockIndex],
          position: {
            ...updatedBlocks[blockIndex].position,
            y: newY
          }
        }
        
        setCurrentDashboard((prev) => ({
          ...prev,
          blocks: updatedBlocks,
          metadata: {
            ...prev.metadata,
            updatedAt: new Date().toISOString(),
            version: prev.metadata.version + 1,
          }
        }))
      }
    }
  }, [currentDashboard.blocks, addBlockFromTemplate])

  const updateBlock = useCallback((blockId: string, updates: Partial<DashboardBlock>) => {
    setCurrentDashboard((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block)),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
        version: prev.metadata.version + 1,
      },
    }))
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setCurrentDashboard((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
        version: prev.metadata.version + 1,
      },
    }))
    
    // Si le bloc supprimé était sélectionné, réinitialiser la sélection
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null)
      setShowConfigPanel(false)
    }
  }, [selectedBlock])

  const handleSave = async () => {
    if (!onSave) return

    try {
      setIsSaving(true)
      // Assurons-nous que le nom est synchronisé avec le titre
      const dashboardToSave = {
        ...currentDashboard,
        name: currentDashboard.title,
      }
      await onSave(dashboardToSave)
      setIsEditMode(false)
      toast({
        title: "Dashboard sauvegardé",
        description: "Votre dashboard a été enregistré avec succès",
      })
    } catch (error) {
      toast({
        title: "Échec de la sauvegarde",
        description: "Impossible d'enregistrer le dashboard. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(currentDashboard, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${(currentDashboard.title || "dashboard").toLowerCase().replace(/\s+/g, "-")}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Dashboard exported",
      description: "Dashboard configuration has been downloaded",
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedDashboard = JSON.parse(e.target?.result as string)
        setCurrentDashboard(importedDashboard)
        toast({
          title: "Dashboard imported",
          description: "Dashboard has been imported successfully",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid dashboard file format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }
  
  // AI Assistant functions
  const handleSendPrompt = async () => {
    if (!aiPrompt.trim()) return
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: aiPrompt }
    setAiMessages(prev => [...prev, userMessage])
    setAiPrompt("")
    setIsAiLoading(true)
    
    try {
      // Send prompt to AI service
      const dashboardContext = JSON.stringify({
        title: currentDashboard.title || "Untitled Dashboard",
        description: currentDashboard.description || "",
        blockCount: currentDashboard.blocks.length,
        blockTypes: currentDashboard.blocks.map(b => b.type)
      })
      
      const prompt = `Dashboard context: ${dashboardContext}\n\nUser question: ${aiPrompt}`
      
      // Use the chat API for general questions
      const result = await dispatch(sendChatMessage(prompt)).unwrap()
      
      if (result && result.assistantMessage) {
        setAiMessages(prev => [...prev, { 
          role: "assistant", 
          content: result.assistantMessage.content 
        }])
      }
    } catch (error) {
      console.error("AI error:", error)
      setAiMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      }])
    } finally {
      setIsAiLoading(false)
    }
  }
  
  const handleGenerateDashboard = async () => {
    if (!aiPrompt.trim()) return
    
    setIsAiLoading(true)
    try {
      // Récupérer les métriques disponibles pour donner du contexte à l'IA
      const availableMetrics = await metricsService.getAvailableMetrics()
      
      const resultAction = await dispatch(
        generateDashboard({ 
          prompt: aiPrompt,
          context: {
            preferredMetrics: availableMetrics
          }
        })
      )

      if (generateDashboard.fulfilled.match(resultAction)) {
        const newDashboard = resultAction.payload
        // Update the current dashboard with AI generated content
        setCurrentDashboard(prev => ({
          ...prev,
          blocks: [...prev.blocks, ...newDashboard.blocks],
          metadata: {
            ...prev.metadata,
            updatedAt: new Date().toISOString(),
            version: prev.metadata.version + 1,
            tags: [...prev.metadata.tags, "ai-generated"]
          }
        }))
        
        setAiMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I've generated and added the requested blocks to your dashboard!" 
        }])
      }
    } catch (error) {
      console.error("Dashboard generation error:", error)
      setAiMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error while generating the dashboard. Please try again." 
      }])
    } finally {
      setIsAiLoading(false)
    }
  }

  // Prévenir la propagation des événements pour éviter les rechargements inutiles
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold">{currentDashboard.title || "Untitled Dashboard"}</h2>
            <div className="flex items-center space-x-2">
              <Badge variant={isEditMode ? "default" : "secondary"}>{isEditMode ? "Edit Mode" : "View Mode"}</Badge>
              {currentDashboard.description && (
                <span className="text-sm text-muted-foreground">{currentDashboard.description}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={showAIAssistant ? "bg-primary/10" : ""}
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dashboard Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-name">Nom du Dashboard</Label>
                  <Input
                    id="dashboard-name"
                    value={currentDashboard.title || ""}
                    onChange={(e) =>
                      setCurrentDashboard((prev) => ({
                        ...prev,
                        title: e.target.value,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-description">Description</Label>
                  <Textarea
                    id="dashboard-description"
                    value={currentDashboard.description}
                    onChange={(e) =>
                      setCurrentDashboard((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Palette className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Dashboard Templates</DialogTitle>
              </DialogHeader>
              <TemplateSelector
                onTemplateSelect={(template) => {
                  setCurrentDashboard({
                    ...currentDashboard,
                    blocks: template.blocks,
                    settings: template.settings,
                  })
                  setShowTemplates(false)
                }}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={() => setShowBlockLibrary(!showBlockLibrary)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          {isEditMode ? (
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Block Library Sidebar */}
        {showBlockLibrary && (
          <div className="w-80 border-r bg-background/95 backdrop-blur overflow-y-auto">
            <ModuleLibrary 
              onClose={() => setShowBlockLibrary(false)} 
              onBlockAdd={addBlockFromTemplate}
            />
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 p-4 bg-muted/30 overflow-auto" onClick={stopPropagation}>
          <DndContext 
            sensors={sensors} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
          >
            <SortableContext 
              items={currentDashboard.blocks.map(block => block.id)} 
              strategy={rectSortingStrategy}
            >
              {currentDashboard.blocks.length > 0 ? (
                <MemoizedDashboardGrid
                  dashboard={currentDashboard}
                  isEditMode={isEditMode}
                  onBlockSelect={setSelectedBlock}
                  onBlockUpdate={updateBlock}
                  onBlockDelete={deleteBlock}
                  onBlockAdd={addBlockFromTemplate}
                  isDragging={isDragging}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <Grid3X3 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Empty Dashboard</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your dashboard by adding blocks or using a template
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={() => setShowTemplates(true)}>
                          <Palette className="w-4 h-4 mr-2" />
                          Browse Templates
                        </Button>
                        <Button variant="outline" onClick={() => setShowBlockLibrary(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Block
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <DragOverlay adjustScale style={{ transformOrigin: '0 0 0' }}>
                {activeId ? (
                  <Card className="w-64 opacity-90 shadow-lg">
                    <CardContent className="p-4">
                      <div className="text-sm font-medium">
                        {activeId.toString().startsWith("block-template-") 
                          ? "Adding new block..." 
                          : "Moving block..."}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </div>

        {/* Configuration Panel */}
        {showConfigPanel && selectedBlock && (
          <div className="w-80 border-l bg-background/95 backdrop-blur overflow-y-auto">
            <BlockConfigPanel
              block={selectedBlock}
              onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
              onClose={() => {
                setShowConfigPanel(false);
                setSelectedBlock(null);
              }}
            />
          </div>
        )}
        
        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <div className="w-80 border-l bg-background/95 backdrop-blur flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-500" />
                <h3 className="font-medium">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAIAssistant(false)}>
                &times;
              </Button>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {aiMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your dashboard or how to improve it!
                    </p>
                  </div>
                ) : (
                  aiMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-[90%] ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))
                )}
                {isAiLoading && (
                  <div className="bg-muted p-3 rounded-lg max-w-[90%]">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-200"></div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about your dashboard..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendPrompt()
                      }
                    }}
                    disabled={isAiLoading}
                  />
                  <Button size="icon" onClick={handleSendPrompt} disabled={isAiLoading || !aiPrompt.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateDashboard} 
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Dashboard Elements
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
