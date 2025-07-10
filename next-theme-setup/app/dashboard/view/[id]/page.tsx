"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit3, ArrowLeft } from "lucide-react";
import { DashboardEditor } from "@/components/dashboard/editor/dashboard-editor";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchDashboard } from "@/lib/store/slices/dashboardSlice";
import type { DashboardLayout } from "@/lib/types/dashboard";

export default function DashboardViewPage() {
  const router = useRouter();
  const { id } = useParams();
  const dashboardId = Array.isArray(id) ? id[0] : id;
  
  const dispatch = useAppDispatch();
  const { currentLayout, isLoading, error } = useAppSelector((state) => state.dashboard);
  
  const [dashboard, setDashboard] = useState<DashboardLayout | null>(null);

  // Charger le dashboard
  useEffect(() => {
    if (dashboardId) {
      dispatch(fetchDashboard(dashboardId));
    }
  }, [dashboardId, dispatch]);

  // Mettre à jour l'état local lorsque le dashboard est chargé
  useEffect(() => {
    if (currentLayout) {
      setDashboard(currentLayout);
    }
  }, [currentLayout]);

  // Rediriger vers l'éditeur
  const handleEdit = () => {
    router.push(`/dashboard/editor?id=${dashboardId}`);
  };

  // Retourner à la liste des dashboards
  const handleBack = () => {
    router.push("/dashboard/my-dashboards");
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 col-span-4" />
          ))}
        </div>
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Une erreur est survenue lors du chargement du dashboard. Veuillez réessayer.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux dashboards
        </Button>
      </div>
    );
  }

  // Dashboard non trouvé
  if (!dashboard) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dashboard non trouvé</AlertTitle>
          <AlertDescription>
            Le dashboard demandé n'existe pas ou a été supprimé.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux dashboards
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{dashboard.name}</h1>
            {dashboard.description && (
              <p className="text-muted-foreground">{dashboard.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button onClick={handleEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Éditer
            </Button>
          </div>
        </div>
      </div>

      <DashboardEditor
        dashboard={dashboard}
        initialViewMode={true}
      />
    </div>
  );
} 