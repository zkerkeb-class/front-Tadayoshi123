"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { dashboardManager } from "@/lib/services/dashboard-manager"
import type { DashboardLayout } from "@/lib/types/dashboard"
import { toast } from "@/hooks/use-toast"
import { Search, Plus, Edit, Trash2, LayoutDashboard, Calendar, Eye, Clock, Tag } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function MyDashboardsPage() {
  const [dashboards, setDashboards] = useState<DashboardLayout[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dashboardToDelete, setDashboardToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadDashboards()
  }, [])

  const loadDashboards = () => {
    const userDashboards = dashboardManager.getDashboards()
    setDashboards(userDashboards)
  }

  const handleCreateDashboard = () => {
    router.push("/dashboard/editor")
  }

  const handleEditDashboard = (id: string) => {
    router.push(`/dashboard/editor?id=${id}`)
  }

  const handleViewDashboard = (id: string) => {
    // Pour l'instant, rediriger vers l'éditeur en mode vue
    router.push(`/dashboard/editor?id=${id}&view=true`)
  }

  const handleDeleteDashboard = (id: string) => {
    setDashboardToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDashboard = () => {
    if (dashboardToDelete) {
      dashboardManager.deleteDashboard(dashboardToDelete)
      loadDashboards()
      toast({
        title: "Dashboard supprimé",
        description: "Le dashboard a été supprimé avec succès",
      })
      setDashboardToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const filteredDashboards = dashboards.filter(
    (dashboard) =>
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dashboard.description && dashboard.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dashboard.tags || dashboard.metadata?.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr })
    } catch (e) {
      return "Date inconnue"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mes Dashboards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez et organisez vos dashboards de supervision
          </p>
        </div>
        <Button onClick={handleCreateDashboard}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Dashboard
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, description ou tag..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {dashboards.length === 0 ? (
            <>
              <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun dashboard</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Vous n'avez pas encore créé de dashboards. Commencez par en créer un nouveau.
              </p>
              <Button onClick={handleCreateDashboard}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un Dashboard
              </Button>
            </>
          ) : (
            <>
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
              <p className="text-muted-foreground">
                Aucun dashboard ne correspond à votre recherche "{searchQuery}"
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDashboards.map((dashboard) => (
            <Card key={dashboard.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl truncate">{dashboard.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewDashboard(dashboard.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditDashboard(dashboard.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Éditer</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {dashboard.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{dashboard.description}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {(dashboard.tags || dashboard.metadata?.tags || []).map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(dashboard.createdAt || dashboard.metadata?.createdAt || new Date().toISOString())}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {dashboard.blocks.length} blocs
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le dashboard sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDashboard} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 