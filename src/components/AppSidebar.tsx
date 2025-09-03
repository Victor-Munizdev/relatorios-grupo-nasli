import { Home, Users, FileText, AlertTriangle, UserCheck, BarChart3 } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Relatórios e análises"
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
    description: "Gerenciar clientes"
  },
  {
    title: "Analistas",
    url: "/analistas",
    icon: UserCheck,
    description: "Gerenciar analistas"
  },
  {
    title: "Ordens de Serviço",
    url: "/ordens-servico",
    icon: FileText,
    description: "Gerenciar O.S."
  },
  {
    title: "Avarias",
    url: "/avarias",
    icon: AlertTriangle,
    description: "Gerenciar avarias"
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/")
  const isExpanded = navigationItems.some((item) => isActive(item.url))

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-lg">
            {state === "collapsed" ? "GN" : "Grupo Nasli"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isItemActive = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={isItemActive ? "bg-primary text-primary-foreground" : ""}
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}