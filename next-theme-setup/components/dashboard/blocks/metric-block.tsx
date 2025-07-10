"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function MetricBlock({ block, className }: MetricBlockProps) {
  const { title, description, config = {}, dataSource } = block;
  const { data, isLoading, error } = useBlockData(dataSource);

  const { 
    previousValue,
    unit = "", 
    precision = 1,
    showChange = true,
    changeType = "percent",
    thresholds = { warning: 70, critical: 90 },
    inverse = false,
    color
  } = config;

  const extractValue = (rawData: any): number | null => {
    if (rawData === null || rawData === undefined) return null;
    if (typeof rawData === 'number') return rawData;
    if (rawData.resultType === 'scalar' || rawData.resultType === 'vector') {
      if (Array.isArray(rawData.result) && rawData.result.length > 0) {
        const valueStr = rawData.result[0].value?.[1] || rawData.result[0][1];
        if (valueStr) return parseFloat(valueStr);
      }
    }
    return null;
  }

  const currentValue = data ? extractValue(data) : (config.value || 0);

  const formatValue = (val: number | null) => {
    if (val === null) return "N/A";
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(precision);
  };

  const calculateChange = () => {
    if (previousValue === undefined || previousValue === null || currentValue === null) return null;
    if (changeType === "percent" && previousValue !== 0) {
      return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    }
    return currentValue - previousValue;
  };

  const change = calculateChange();

  const getValueColor = () => {
    if (color) return color;
    if (currentValue === null) return "";
    
    if (inverse) {
      if (currentValue <= thresholds.critical) return "text-destructive";
      if (currentValue <= thresholds.warning) return "text-warning";
    } else {
      if (currentValue >= thresholds.critical) return "text-destructive";
      if (currentValue >= thresholds.warning) return "text-warning";
    }
    return "text-success";
  };

  const getChangeColor = () => {
    if (change === null) return "text-muted-foreground";
    if (change > 0) return inverse ? "text-destructive" : "text-success";
    if (change < 0) return inverse ? "text-success" : "text-destructive";
    return "text-muted-foreground";
  };

  const formatChange = () => {
    if (change === null) return "";
    const prefix = change > 0 ? "+" : "";
    const formattedChange = Math.abs(change).toFixed(precision);
    return changeType === "percent" ? `${prefix}${formattedChange}%` : `${prefix}${formattedChange}${unit}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-6 w-24 mt-2 rounded-md" />
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center py-4 text-destructive">
          <AlertTriangle className="h-6 w-6" />
          <p className="mt-2 text-sm text-center">{error}</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className={`text-4xl font-bold ${getValueColor()}`}>
          {formatValue(currentValue)}{unit && <span className="text-xl ml-1">{unit}</span>}
        </div>
        {showChange && change !== null && (
          <div className={`flex items-center mt-2 ${getChangeColor()}`}>
            {change > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : change < 0 ? <ArrowDown className="h-4 w-4 mr-1" /> : <Minus className="h-4 w-4 mr-1" />}
            <span className="text-sm">{formatChange()}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Métrique"}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 