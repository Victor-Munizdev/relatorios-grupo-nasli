import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Plus, Eye, Edit, Users, UserCheck, FileText, AlertTriangle, ChevronDown } from "lucide-react"
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
                Sistema de Relatórios - Grupo Nasli
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Gerenciar</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background border z-50" align="start">
                  {/* Clientes */}
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Clientes
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/clientes/novo")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Cadastrar Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/clientes")} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar Clientes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/clientes")} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editar Clientes
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Analistas */}
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Analistas
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/analistas/novo")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Cadastrar Analista
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/analistas")} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar Analistas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/analistas")} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editar Analistas
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Ordens de Serviço */}
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ordens de Serviço
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/ordens-servico/nova")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Cadastrar O.S.
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/ordens-servico")} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar O.S.
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/ordens-servico")} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editar O.S.
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Avarias */}
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Avarias
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/avarias/nova")} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Cadastrar Avaria
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/avarias")} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar Avarias
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/avarias")} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Editar Avarias
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Menu do Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Usuário</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border z-50" align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/perfil")} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/configuracoes")} className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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