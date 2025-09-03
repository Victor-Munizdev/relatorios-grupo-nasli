import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Moon, Sun, Users, Plus, Trash2, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

const ConfiguracoesPage = () => {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [usuarios] = useState([
    { id: 1, nome: "João Silva", email: "joao@exemplo.com" },
    { id: 2, nome: "Maria Santos", email: "maria@exemplo.com" }
  ])
  
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    senha: ""
  })

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleAddUser = () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos do usuário.",
        variant: "destructive",
      })
      return
    }

    // Aqui seria a integração com Supabase
    toast({
      title: "Sucesso",
      description: "Usuário cadastrado com sucesso!",
    })
    
    setNovoUsuario({ nome: "", email: "", senha: "" })
  }

  const handleDeleteUser = (id: number) => {
    // Aqui seria a integração com Supabase
    toast({
      title: "Sucesso", 
      description: "Usuário removido com sucesso!",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>

        {/* Tema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Aparência
            </CardTitle>
            <CardDescription>
              Configure o tema da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Ative o tema escuro da aplicação
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gerenciar Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Usuários
            </CardTitle>
            <CardDescription>
              Adicione, visualize e remova usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adicionar Novo Usuário */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Novo Usuário
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={novoUsuario.nome}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoUsuario.email}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@exemplo.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha Temporária</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={novoUsuario.senha}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                    placeholder="Senha inicial"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddUser} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Usuário
              </Button>
            </div>

            {/* Lista de Usuários */}
            <div className="space-y-2">
              <h3 className="font-medium">Usuários Cadastrados</h3>
              <div className="space-y-2">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default ConfiguracoesPage