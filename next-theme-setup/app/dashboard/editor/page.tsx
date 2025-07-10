"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { DashboardEditor } from "@/components/dashboard/editor/dashboard-editor"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchDashboard, saveDashboard } from "@/lib/store/slices/dashboardSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { DashboardLayout } from "@/lib/types/dashboard"
import { systemMonitoringDashboard, applicationMonitoringDashboard } from "@/lib/dashboard/dashboard-metrics-config"
import { useToast } from "@/hooks/use-toast"
import { Dashboard } from "@/lib/types/dashboard"
import { nanoid } from "nanoid"

export default function DashboardEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dashboardId = searchParams.get("id")
  const templateId = searchParams.get("template")
  const showAI = searchParams.get("ai") === "true"
  
  const dispatch = useAppDispatch()
  const { currentLayout, isLoading, error } = useAppSelector((state) => state.dashboard)
  
  const [dashboard, setDashboard] = useState<DashboardLayout | null>(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
  const { toast: useToastToast } = useToast()

  // Charger le dashboard si un ID est fourni
  useEffect(() => {
    if (dashboardId) {
      dispatch(fetchDashboard(dashboardId))
    } else if (templateId) {
      // Charger un template prédéfini si spécifié
      let templateDashboard: Omit<DashboardLayout, 'id'> | null = null
      
      switch (templateId) {
        case 'system':
          templateDashboard = systemMonitoringDashboard
          break
        case 'application':
          templateDashboard = applicationMonitoringDashboard
          break
      }
      
      if (templateDashboard) {
        const newDashboard = {
          ...templateDashboard,
          id: `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setDashboard(newDashboard as DashboardLayout)
      }
    }
  }, [dashboardId, templateId, dispatch])

  // Mettre à jour l'état local lorsque le dashboard est chargé
  useEffect(() => {
    if (currentLayout) {
      setDashboard(currentLayout)
    }
  }, [currentLayout])

  // Gérer la sauvegarde du dashboard
  const handleSave = async (updatedDashboard: DashboardLayout) => {
    try {
      await dispatch(saveDashboard(updatedDashboard)).unwrap()
      toast({
        title: "Dashboard sauvegardé",
        description: "Votre dashboard a été sauvegardé avec succès",
      })
      
      // Rediriger vers la page de visualisation si c'est un nouveau dashboard
      if (!dashboardId) {
        router.push(`/dashboard/view/${updatedDashboard.id}`)
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du dashboard",
        variant: "destructive",
      })
    }
  }

  // Gérer l'auto-sauvegarde
  const handleAutoSave = async (updatedDashboard: DashboardLayout) => {
    try {
      await dispatch(saveDashboard(updatedDashboard)).unwrap()
    } catch (error) {
      console.error("Auto-save error:", error)
    }
  }

  // Simuler le chargement d'un dashboard
  useEffect(() => {
    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      // Créer un dashboard vide
      const emptyDashboard: Dashboard = {
        id: "new-dashboard",
        title: "Nouveau Dashboard",
        description: "Créez votre dashboard personnalisé",
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setDashboard(emptyDashboard as DashboardLayout)
      setIsLoadingDashboard(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Afficher un état de chargement
  if (dashboardId && isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 col-span-4" />
          ))}
        </div>
      </div>
    )
  }

  // Afficher une erreur
  if (dashboardId && error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Une erreur est survenue lors du chargement du dashboard. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      {isLoadingDashboard ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Chargement de l'éditeur...</p>
          </div>
        </div>
      ) : (
        dashboard && (
          <DashboardEditor 
            initialDashboard={dashboard} 
            onSave={handleSave}
            onAutoSave={handleAutoSave}
            showAIAssistantByDefault={showAI || (!dashboardId && !templateId)}
          />
        )
      )}
    </div>
  )
}
