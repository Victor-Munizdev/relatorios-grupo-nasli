import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    })
    navigate("/")
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-background flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="font-semibold text-lg text-primary">
                Sistema de Relatórios
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Usuário</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout