import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Lock, Camera, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const PerfilPage = () => {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    nome: "",
    email: "",
    senha: "",
    foto: ""
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Buscar dados do perfil na tabela usuarios
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (userData) {
        setProfileData({
          nome: userData.nome || "",
          email: userData.email || user.email || "",
          senha: "",
          foto: ""
        })
      } else {
        // Criar registro na tabela usuarios se não existir
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({
            id: user.id,
            nome: user.user_metadata?.nome || user.email?.split('@')[0] || "",
            email: user.email || "",
            cargo: 'Usuário'
          })

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError)
        } else {
          setProfileData({
            nome: user.user_metadata?.nome || user.email?.split('@')[0] || "",
            email: user.email || "",
            senha: "",
            foto: ""
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil.",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Atualizar tabela usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          nome: profileData.nome,
          email: profileData.email,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Atualizar email no auth se mudou
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email
        })
        if (emailError) throw emailError
      }

      // Atualizar senha se foi fornecida
      if (profileData.senha) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: profileData.senha
        })
        if (passwordError) throw passwordError
        setProfileData(prev => ({ ...prev, senha: "" }))
      }
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      })
      
      setIsEditing(false)
      await loadUserData() // Recarregar dados
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o perfil.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setLoading(true)
      
      // Upload para o Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setProfileData(prev => ({ ...prev, foto: data.publicUrl }))
      
      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível fazer upload da foto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Edite suas informações pessoais" : "Visualize suas informações pessoais"}
            </p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Suas informações de usuário no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto do Perfil */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.foto} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="photo-upload"
                  />
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Alterar Foto
                  </Button>
                </div>
              )}
            </div>

            {/* Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    value={profileData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="senha">Nova Senha (opcional)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="senha"
                      type="password"
                      value={profileData.senha}
                      onChange={(e) => handleInputChange("senha", e.target.value)}
                      className="pl-10"
                      placeholder="Digite uma nova senha"
                    />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default PerfilPage