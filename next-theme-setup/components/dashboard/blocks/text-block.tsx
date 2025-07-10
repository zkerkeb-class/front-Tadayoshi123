"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardBlock } from "@/lib/types/dashboard";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";

interface TextBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function TextBlock({ block, className }: TextBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);
  const { content = "", format = "markdown", prefix = "", suffix = "" } = config;

  const extractValue = (rawData: any): string | null => {
    if (rawData === null || rawData === undefined) return null;
    if (typeof rawData !== 'object') return rawData.toString();
    
    if (rawData.resultType === 'scalar' || rawData.resultType === 'vector') {
      if (Array.isArray(rawData.result) && rawData.result.length > 0) {
        return rawData.result[0].value?.[1] || rawData.result[0][1] || null;
      }
    }
    return null;
  }

  const dynamicContent = data ? extractValue(data) : null;
  const textContent = dynamicContent !== null ? `${prefix}${dynamicContent}${suffix}` : (content || "Double-cliquez pour éditer ce bloc de texte.");

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-8 w-3/4" />;
    }
    if (error) {
      return <p className="text-destructive text-sm">{error}</p>;
    }

    if (format === "markdown") {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{textContent}</ReactMarkdown>
        </div>
      );
    }
    
    return <div className="whitespace-pre-wrap">{textContent}</div>;
  }

  return (
    <Card className={cn("h-full w-full overflow-hidden", className)}>
      {config.showTitle !== false && title && (
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 