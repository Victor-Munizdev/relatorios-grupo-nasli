import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

const AuthForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      })

      navigate("/dashboard")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: formData.nome
          }
        }
      })

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Conta criada! Verifique seu email para ativar a conta.",
      })

      setFormData({ nome: "", email: "", password: "", confirmPassword: "" })
      setIsLogin(true)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-login-card shadow-xl border-0">
      <CardHeader className="text-center space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">
          {isLogin ? "Entrar" : "Criar Conta"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isLogin 
            ? "Digite suas credenciais para acessar o sistema" 
            : "Preencha os dados para criar sua conta"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-foreground">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="pl-10 bg-login-input-bg border-border"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 bg-login-input-bg border-border"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 bg-login-input-bg border-border"
                placeholder="Digite sua senha"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 bg-login-input-bg border-border"
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
            disabled={loading}
          >
            {loading ? "Processando..." : (isLogin ? "ENTRAR" : "CRIAR CONTA")}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button
            variant="link"
            className="text-muted-foreground text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? "Não tem conta? Criar conta" 
              : "Já tem conta? Fazer login"
            }
          </Button>
          
          {isLogin && (
            <Button
              variant="link"
              className="text-muted-foreground text-sm"
              onClick={() => {
                // Implementar reset de senha
                toast({
                  title: "Recurso em desenvolvimento",
                  description: "A recuperação de senha será implementada em breve.",
                })
              }}
            >
              Esqueceu sua senha?
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AuthForm