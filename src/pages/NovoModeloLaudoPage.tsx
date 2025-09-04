import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, ArrowLeft, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const NovoModeloLaudoPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    template: "",
    ativo: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Nome e descrição são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Sucesso",
        description: "Modelo de laudo cadastrado com sucesso!",
      })
      
      navigate("/modelos-laudos")
    } catch (error) {
      console.error('Erro ao cadastrar modelo:', error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o modelo de laudo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/modelos-laudos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Cadastrar Novo Modelo de Laudo
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados do novo modelo de laudo
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Modelo</CardTitle>
            <CardDescription>
              Informações do modelo de laudo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Modelo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome do modelo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ativo">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => handleInputChange("ativo", checked)}
                    />
                    <Label htmlFor="ativo">
                      {formData.ativo ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descrição do modelo de laudo"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Textarea
                  id="template"
                  value={formData.template}
                  onChange={(e) => handleInputChange("template", e.target.value)}
                  placeholder="Conteúdo do template do laudo"
                  rows={8}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Modelo"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/modelos-laudos")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default NovoModeloLaudoPage