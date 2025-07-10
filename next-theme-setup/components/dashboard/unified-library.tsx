import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockLibrary } from './block-library';
import { ModuleLibrary } from './module-library';
import { DashboardBlockType } from '@/lib/types/dashboard';

interface UnifiedLibraryProps {
  onAddBlock: (type: DashboardBlockType) => void;
  onAddModule: (templateId: string) => void;
}

export function UnifiedLibrary({ onAddBlock, onAddModule }: UnifiedLibraryProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blocks">Blocs</TabsTrigger>
            <TabsTrigger value="modules">Templates</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="blocks" className="flex-1 p-4 overflow-y-auto">
          <BlockLibrary onAddBlock={onAddBlock} />
        </TabsContent>
        <TabsContent value="modules" className="flex-1 p-4 overflow-y-auto">
          <ModuleLibrary onAddModule={onAddModule} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 