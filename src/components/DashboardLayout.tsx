import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Plus, Eye, Edit, Users, UserCheck, FileText, AlertTriangle, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    loadUserData()
    
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/")
      } else if (event === 'SIGNED_IN' && session?.user) {
        loadUserData()
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/")
        return
      }

      setUser(user)

      // Buscar dados do perfil na tabela usuarios
      const { data: profile } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        setUserData(profile)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      })
      navigate("/")
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      })
    }
  }

  const getUserName = () => {
    if (userData?.nome) return userData.nome
    if (user?.email) return user.email.split('@')[0]
    return "Usuário"
  }

  const getUserInitials = () => {
    const name = getUserName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{getUserName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border z-50" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
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