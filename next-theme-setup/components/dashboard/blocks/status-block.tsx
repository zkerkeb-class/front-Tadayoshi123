import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, AlertCircle, Clock, Loader2 } from "lucide-react";
import type { DashboardBlock } from "@/lib/types/dashboard";
import { useBlockData } from "@/hooks/use-block-data";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusBlockProps {
  block: DashboardBlock;
  className?: string;
}

export function StatusBlock({ block, className }: StatusBlockProps) {
  const { title, description } = block;
  const { data, isLoading, error } = useBlockData(block.dataSource);

  const statusData = !isLoading && data && typeof data === 'object' ? data : {};
  const { status = "unknown", message = "", lastCheck } = { ...block.config, ...statusData };

  const getStatusColor = () => {
    switch (status) {
      case "operational": return "bg-success text-success-foreground";
      case "degraded": return "bg-yellow-500 text-white";
      case "outage": return "bg-destructive text-destructive-foreground";
      case "maintenance": return "bg-info text-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "operational": return <CheckCircle className="h-5 w-5" />;
      case "degraded": return <AlertTriangle className="h-5 w-5" />;
      case "outage": return <AlertCircle className="h-5 w-5" />;
      case "maintenance": return <Clock className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Inconnu";
    try {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
    } catch (e) {
      return "Format invalide";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "operational": return "Opérationnel";
      case "degraded": return "Performance dégradée";
      case "outage": return "Service indisponible";
      case "maintenance": return "En maintenance";
      default: return "Statut inconnu";
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
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

    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <div className={`p-3 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <Badge className={getStatusColor()}>
          {getStatusText()}
        </Badge>
        {message && (
          <p className="text-center text-sm mt-2">{message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Dernière vérification: {formatDate(lastCheck)}
        </p>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{title || "Statut du système"}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
} 