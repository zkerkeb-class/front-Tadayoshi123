"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { DashboardBlock } from "@/lib/types/dashboard";

// Import des composants de blocs
import { LineChartBlock } from "./line-chart-block";
import { BarChartBlock } from "./bar-chart-block";
import { PieChartBlock } from "./pie-chart-block";
import { GaugeBlock } from "./gauge-block";
import { MetricBlock } from "./metric-block";
import { TableBlock } from "./table-block";
import { TextBlock } from "./text-block";
import { StatusBlock } from "./status-block";
import { AlertListBlock } from "./alert-list-block";

interface BlockRendererProps {
  block: DashboardBlock;
  isEditing?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

export const BlockRenderer = memo(function BlockRenderer({
  block,
  isEditing = false,
  className,
  onError
}: BlockRendererProps) {
  const renderBlock = () => {
    try {
      switch (block.type) {
        case "line-chart":
          return <LineChartBlock block={block} className={className} />;
        case "bar-chart":
          return <BarChartBlock block={block} className={className} />;
        case "pie-chart":
          return <PieChartBlock block={block} className={className} />;
        case "gauge":
          return <GaugeBlock block={block} className={className} />;
        case "metric":
          return <MetricBlock block={block} className={className} />;
        case "table":
          return <TableBlock block={block} className={className} />;
        case "text":
          return <TextBlock block={block} className={className} />;
        case "status":
          return <StatusBlock block={block} className={className} />;
        case "alert-list":
          return <AlertListBlock block={block} className={className} />;
        default:
          return (
            <div className={cn("p-4 border rounded-md", className)}>
              <p className="text-muted-foreground">Type de bloc non supporté: {block.type}</p>
            </div>
          );
      }
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      return (
        <div className={cn("p-4 border border-destructive rounded-md", className)}>
          <p className="text-destructive">Erreur de rendu du bloc</p>
          {isEditing && error instanceof Error && (
            <p className="text-xs text-muted-foreground mt-2">{error.message}</p>
          )}
        </div>
      );
    }
  };

  return renderBlock();
}); 