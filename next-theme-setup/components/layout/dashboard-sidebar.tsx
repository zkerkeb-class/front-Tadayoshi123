import { Activity, BarChart, Settings, Server, Users, LayoutDashboard, Bot, Folder, Edit, CreditCard } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { DashboardSidebarItem } from "@/components/ui/dashboard-sidebar-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string
  href: string
  icon: string
  description?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

// Mapping des noms d'icônes aux composants Lucide
const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  chart: BarChart,
  bot: Bot,
  folder: Folder,
  edit: Edit,
  users: Users,
  settings: Settings,
  server: Server,
  alert: Activity,
  creditCard: CreditCard,
}

const defaultNavigationItems: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: "dashboard",
        description: "See a general overview of your account",
      },
      {
        title: "Mes Dashboards",
        href: "/dashboard/my-dashboards",
        icon: "folder",
        description: "Gérez vos dashboards personnalisés",
      },
      {
        title: "Editor",
        href: "/dashboard/editor",
        icon: "edit",
        description: "Créez et éditez vos dashboards",
      },
      {
        title: "Assistant",
        href: "/dashboard/assistant",
        icon: "bot",
        description: "Get AI-powered infrastructure help",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: "users",
        description: "Manage users and permissions",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Account",
        href: "/dashboard/settings",
        icon: "settings",
        description: "Manage your account settings",
      },
      {
        title: "Billing & Subscription",
        href: "/dashboard/settings/billing",
        icon: "creditCard",
        description: "Manage your billing and subscription plan",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Service Verification",
        href: "/dashboard/system/verification",
        icon: "alert",
        description: "Monitor service health and availability",
      },
      {
        title: "System Status",
        href: "/dashboard/infrastructure",
        icon: "server",
        description: "Overall system health dashboard",
      },
    ],
  },
]

interface DashboardSidebarProps {
  isCollapsed: boolean
  items?: NavItem[]
}

export const DashboardSidebar = ({ isCollapsed, items }: DashboardSidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Créer les sections de navigation à partir des items passés en props ou utiliser les valeurs par défaut
  const navigationItems = items ? [
    {
      title: "Navigation",
      items: items.map(item => ({
        ...item,
        description: item.description || item.title
      }))
    }
  ] : defaultNavigationItems
  
  return (
    <div className="flex flex-col h-full w-full max-w-[240px]">
      <div className="px-2 py-2 text-center border-b">
        <h1 className={`font-bold transition-all duration-200 ${isCollapsed ? "text-sm" : "text-xl"}`}>
          {isCollapsed ? "SV" : "SupervIA"}
        </h1>
      </div>
      
      <ScrollArea className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-1">
          {navigationItems.map((section) => (
            <div key={section.title} className="mb-4">
              {!isCollapsed && (
                <h2 className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = typeof item.icon === 'string' ? iconMap[item.icon] || LayoutDashboard : item.icon
                  return (
                    <DashboardSidebarItem
                      key={item.href}
                      href={item.href}
                      icon={Icon}
                      title={item.title}
                      description={item.description || ""}
                      isCollapsed={isCollapsed}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-auto p-2 border-t text-center">
        <div className={`text-xs text-muted-foreground ${isCollapsed ? "hidden" : "block"}`}>
          SupervIA v1.0
        </div>
      </div>
    </div>
  )
} 