import React, { useState, useEffect, useCallback } from 'react';
import { nanoid } from "nanoid";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Edit, Grid, Settings, Palette, Download, Upload, Bot, Trash, Plus, X, PanelLeft, PanelRight, LayoutDashboard } from 'lucide-react';
import { DashboardGrid } from './dashboard-grid';
import { BlockLibrary } from '../block-library';
import { BlockConfigPanel } from '../block-config-panel';
import { TemplateSelector } from '../template-selector';
import { AIAssistant } from './ai-assistant';
import { DashboardBlock, Dashboard, DashboardBlockType } from '@/lib/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { ModuleLibrary } from '../module-library';
import { UnifiedLibrary } from '../unified-library';
import { cn } from '@/lib/utils';
import { getDashboardTemplate } from '@/lib/dashboard/dashboard-templates';
import { createBlockFromMetricsTemplate } from '@/lib/dashboard/metrics-templates';

interface DashboardEditorProps {
  dashboard?: Dashboard;
  onSave?: (dashboard: Dashboard) => void;
  onAutoSave?: (dashboard: Dashboard) => void;
  initialViewMode?: boolean;
}

export function DashboardEditor({ dashboard: initialDashboard, onSave, onAutoSave, initialViewMode = false }: DashboardEditorProps) {
  // État du dashboard
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard>(initialDashboard || {
    id: nanoid(),
    title: 'Nouveau Dashboard',
    description: 'Description du dashboard',
    blocks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // États UI
  const [isEditMode, setIsEditMode] = useState(!initialViewMode);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [activePanel, setActivePanel] = useState<'library' | 'ai' | 'config' | 'templates' | 'settings' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Messages AI
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Gérer l'ouverture des panneaux
  const togglePanel = (panel: 'library' | 'ai' | 'templates' | 'settings') => {
    setActivePanel(prev => (prev === panel ? null : panel));
    setSelectedBlockId(undefined);
  };

  // Sélectionner un bloc
  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setActivePanel('config');
  };

  // Fermer tous les panneaux
  const closePanels = () => {
    setSelectedBlockId(undefined);
    setActivePanel(null);
  };

  const handleUpdateMetadata = (key: 'title' | 'description', value: string) => {
    setCurrentDashboard(prev => ({
        ...prev,
        [key]: value,
        ...(key === 'title' && { name: value }),
        updatedAt: new Date().toISOString(),
    }));
  };

  // Ajouter un bloc
  const handleAddBlock = (block: DashboardBlock) => {
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: [...prev.blocks, block],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedBlockId(block.id);
    setActivePanel('config');
    toast({
      title: 'Bloc ajouté',
      description: `Le bloc ${block.title || 'sans titre'} a été ajouté`,
    });
  };

  // Ajouter un bloc par type
  const handleAddBlockByType = (type: DashboardBlockType) => {
    const newBlock: DashboardBlock = {
      id: nanoid(),
      type,
      title: `Nouveau bloc ${type}`,
      layout: {
        x: 0,
        y: 0,
        w: 4,
        h: 4
      },
      config: {}
    };
    handleAddBlock(newBlock);
  };

  // Ajouter un module/template de métriques
  const handleAddModule = (templateId: string) => {
    const newBlock = createBlockFromMetricsTemplate(templateId, { x: 0, y: 0, w: 6, h: 5 });
    if (newBlock) {
      handleAddBlock(newBlock);
      toast({
        title: 'Module ajouté',
        description: `Le module "${newBlock.title}" a été ajouté à votre dashboard.`,
      });
    } else {
      toast({
        title: 'Erreur',
        description: `Impossible de trouver le module avec l'ID ${templateId}.`,
        variant: 'destructive',
      });
    }
  };

  // Mettre à jour un bloc
  const handleUpdateBlock = (updatedBlock: DashboardBlock) => {
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === updatedBlock.id ? updatedBlock : block
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Supprimer un bloc
  const handleDeleteBlock = (blockId: string) => {
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(undefined);
      setActivePanel(null);
    }
    toast({
      title: 'Bloc supprimé',
      description: 'Le bloc a été supprimé du dashboard',
    });
  };

  // Mettre à jour la disposition des blocs
  const handleLayoutChange = (layout: any) => {
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        const layoutItem = layout.find((item: any) => item.i === block.id);
        if (layoutItem) {
          return {
            ...block,
            layout: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            },
          };
        }
        return block;
      }),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Sauvegarder le dashboard
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(currentDashboard);
      }
      setIsEditMode(false);
      toast({
        title: 'Dashboard sauvegardé',
        description: 'Votre dashboard a été sauvegardé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le dashboard',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Gérer les messages AI
  const handleSendPrompt = async (message: string) => {
    setIsAiLoading(true);
    setAiError(null);
    
    // Ajouter le message de l'utilisateur
    const userMessage = { role: 'user', content: message };
    setAiMessages(prev => [...prev, userMessage]);
    
    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant', 
        content: `Voici une suggestion basée sur votre demande: "${message}". Je peux vous aider à créer un dashboard qui répond à vos besoins.` 
      };
      setAiMessages(prev => [...prev, aiResponse]);
      setIsAiLoading(false);
    }, 1500);
  };

  // Générer un dashboard avec l'IA
  const handleGenerateDashboard = (prompt: string) => {
    setIsAiLoading(true);
    setAiError(null);
    
    // Simuler la génération
    setTimeout(() => {
      setIsAiLoading(false);
      toast({
        title: 'Génération terminée',
        description: 'Le dashboard a été généré avec succès',
      });
    }, 2000);
  };

  // Appliquer une suggestion de l'IA
  const handleApplySuggestion = (blocks: DashboardBlock[]) => {
    setCurrentDashboard(prev => ({
      ...prev,
      blocks: [...prev.blocks, ...blocks],
      updatedAt: new Date().toISOString(),
    }));
    toast({
      title: 'Suggestion appliquée',
      description: `${blocks.length} blocs ont été ajoutés au dashboard`,
    });
  };

  // Bloc sélectionné
  const selectedBlock = currentDashboard.blocks.find(block => block.id === selectedBlockId);

  return (
    <div className="flex h-full bg-muted/30">
      {/* Left Vertical Toolbar */}
      <aside className="flex flex-col items-center gap-4 p-2 bg-background border-r">
        <Button variant="ghost" size="icon" className="text-primary h-10 w-10">
          <LayoutDashboard />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-2">
           <Button variant={activePanel === 'library' ? "secondary" : "ghost"} size="icon" onClick={() => togglePanel('library')} title="Ajouter un bloc">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant={activePanel === 'ai' ? "secondary" : "ghost"} size="icon" onClick={() => togglePanel('ai')} title="Assistant IA">
            <Bot className="h-5 w-5" />
          </Button>
           <Button variant={activePanel === 'templates' ? "secondary" : "ghost"} size="icon" onClick={() => togglePanel('templates')} title="Templates">
            <Palette className="h-5 w-5" />
          </Button>
        </div>
        <Button variant={activePanel === 'settings' ? "secondary" : "ghost"} size="icon" onClick={() => togglePanel('settings')} title="Paramètres">
          <Settings className="h-5 w-5" />
        </Button>
      </aside>

      {/* Panels Container */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        activePanel === 'library' ? 'w-[300px]' : 'w-0'
      )}>
        {activePanel === 'library' && (
          <div className="w-[300px] h-full border-r bg-background overflow-auto">
             <div className="flex items-center justify-between p-2 border-b">
                <h3 className="font-medium text-sm ml-2">Bibliothèque</h3>
                <Button variant="ghost" size="icon" onClick={closePanels}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            <UnifiedLibrary onAddBlock={handleAddBlockByType} onAddModule={handleAddModule} />
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-4">
            <div>
              <Input
                value={currentDashboard.title}
                onChange={(e) => handleUpdateMetadata('title', e.target.value)}
                className="font-semibold text-lg border-none focus-visible:ring-0 px-0 max-w-[300px] h-8"
                placeholder="Titre du dashboard"
                disabled={!isEditMode}
              />
              <Input
                value={currentDashboard.description || ''}
                onChange={(e) => handleUpdateMetadata('description', e.target.value)}
                className="text-sm text-muted-foreground border-none focus-visible:ring-0 px-0 resize-none h-6 max-w-[500px]"
                placeholder="Description du dashboard"
                disabled={!isEditMode}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            ) : (
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Éditer
              </Button>
            )}
             <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? "Passer en mode vue" : "Passer en mode édition"}
            </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4">
            <DashboardGrid
              blocks={currentDashboard.blocks}
              isEditing={isEditMode}
              onLayoutChange={handleLayoutChange}
              onBlockSelect={handleSelectBlock}
              onBlockRemove={handleDeleteBlock}
              selectedBlockId={selectedBlockId}
            />
        </div>
      </main>

      {/* Right Panels Container */}
       <div className={cn(
        "transition-all duration-300 ease-in-out bg-background border-l",
        activePanel === 'config' && selectedBlock ? 'w-[300px]' : 
        activePanel === 'ai' ? 'w-[400px]' : 'w-0'
      )}>
         {activePanel === 'config' && selectedBlock && (
            <div className="w-[300px] h-full overflow-auto">
              <div className="flex items-center justify-between p-2 border-b">
                <h3 className="font-medium text-sm ml-2">Configuration</h3>
                <Button variant="ghost" size="icon" onClick={closePanels}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <BlockConfigPanel
                  block={selectedBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onDeleteBlock={handleDeleteBlock}
                />
            </div>
          )}
          
          {activePanel === 'ai' && (
            <div className="w-[400px] h-full overflow-hidden">
                <AIAssistant
                  onClose={closePanels}
                  dashboard={currentDashboard}
                  onApplyBlocks={(blocks) => {
                    setCurrentDashboard(prev => ({
                      ...prev,
                      blocks: [...prev.blocks, ...blocks],
                      updatedAt: new Date().toISOString(),
                    }));
                    toast({
                      title: "Blocs Ajoutés",
                      description: `${blocks.length} nouveaux blocs ont été ajoutés à votre dashboard.`
                    });
                    setActivePanel(null);
                  }}
                />
            </div>
          )}
      </div>
      
      {/* Templates dialog */}
      <Dialog open={activePanel === 'templates'} onOpenChange={() => setActivePanel(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Templates de Dashboard</DialogTitle>
          </DialogHeader>
          <TemplateSelector
            onSelectTemplate={(templateId) => {
              try {
                // Récupérer le template à partir de son ID
                const template = getDashboardTemplate(templateId);
                if (template) {
                  // Convertir DashboardLayout en Dashboard
                  setCurrentDashboard({
                    id: nanoid(),
                    title: template.name,
                    description: template.description,
                    blocks: template.blocks,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    tags: template.tags,
                    isPublic: template.isPublic
                  });
                  toast({
                    title: "Template appliqué",
                    description: `Le template ${template.name} a été appliqué`
                  });
                }
              } catch (error) {
                console.error("Erreur lors de l'application du template:", error);
                toast({
                  title: "Erreur",
                  description: "Impossible d'appliquer le template",
                  variant: "destructive"
                });
              }
              setActivePanel(null);
            }}
            onClose={() => setActivePanel(null)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Settings dialog (could be converted to a panel too) */}
      <Dialog open={activePanel === 'settings'} onOpenChange={() => setActivePanel(null)}>
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
                      handleUpdateMetadata('title', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-description">Description</Label>
                  <Textarea
                    id="dashboard-description"
                    value={currentDashboard.description || ''}
                    onChange={(e) =>
                      handleUpdateMetadata('description', e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 