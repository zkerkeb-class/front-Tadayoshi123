import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
}

interface AlertListBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function AlertListBlock({ block, className }: AlertListBlockProps) {
  const { title, config = {} } = block;
  const { data, isLoading, error } = useBlockData(block.dataSource);

  const alerts: Alert[] = !isLoading && data && Array.isArray(data) ? data : [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "warning": return "bg-yellow-500 text-white";
      case "info": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp));
    } catch (e) {
      return timestamp;
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
       return (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[200px] text-destructive">
          <AlertTriangle className="h-8 w-8" />
          <p className="mt-2 text-sm text-center">{error}</p>
        </div>
      );
    }
    if (alerts.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          Aucune alerte active
        </div>
      );
    }
    return (
       <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {alerts.map((alert: Alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-2 border rounded-md">
            <div className={`mt-1 p-1.5 rounded-full ${getSeverityColor(alert.severity)}`}>
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</p>
            </div>
            <Badge variant={alert.severity === "critical" ? "destructive" : "outline"} className="capitalize">
              {alert.severity}
            </Badge>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Alertes"}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 