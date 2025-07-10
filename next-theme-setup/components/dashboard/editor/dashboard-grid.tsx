import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { BlockRenderer } from '../blocks/block-renderer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DashboardBlock } from '@/lib/types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  blocks: DashboardBlock[];
  isEditing?: boolean;
  onLayoutChange?: (layout: any) => void;
  onBlockRemove?: (blockId: string) => void;
  onBlockSelect?: (blockId: string) => void;
  selectedBlockId?: string;
}

export function DashboardGrid({
  blocks,
  isEditing = false,
  onLayoutChange,
  onBlockRemove,
  onBlockSelect,
  selectedBlockId,
}: DashboardGridProps) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Layouts pour différentes tailles d'écran
  const layouts = {
    lg: blocks.map(block => ({
      i: block.id,
      x: block.layout?.x || 0,
      y: block.layout?.y || 0,
      w: block.layout?.w || 4,
      h: block.layout?.h || 4,
      minW: 2,
      minH: 2,
    })),
    md: blocks.map(block => ({
      i: block.id,
      x: block.layout?.x || 0,
      y: block.layout?.y || 0,
      w: Math.min(block.layout?.w || 3, 6),
      h: block.layout?.h || 4,
      minW: 2,
      minH: 2,
    })),
    sm: blocks.map(block => ({
      i: block.id,
      x: 0,
      y: block.layout?.y || 0,
      w: 6,
      h: block.layout?.h || 4,
      minW: 2,
      minH: 2,
    })),
    xs: blocks.map(block => ({
      i: block.id,
      x: 0,
      y: block.layout?.y || 0,
      w: 4,
      h: block.layout?.h || 4,
      minW: 2,
      minH: 2,
    })),
  };

  // Attendre le chargement côté client pour éviter les erreurs SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-[300px] bg-muted/20 rounded-lg animate-pulse" />;

  // Gérer les changements de layout
  const handleLayoutChange = (currentLayout: any) => {
    if (!onLayoutChange || !isEditing) return;
    onLayoutChange(currentLayout);
  };

  return (
    <div className="w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 8, sm: 6, xs: 4 }}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={(layout) => handleLayoutChange(layout)}
        compactType="vertical"
        useCSSTransforms={mounted}
      >
        {blocks.map((block) => (
          <div 
            key={block.id} 
            className={`bg-card rounded-lg shadow-sm border ${
              selectedBlockId === block.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onBlockSelect && isEditing && onBlockSelect(block.id)}
          >
            {isEditing && onBlockRemove && (
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlockRemove(block.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="p-4 h-full overflow-hidden">
              <BlockRenderer block={block} isEditing={isEditing} />
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
} 