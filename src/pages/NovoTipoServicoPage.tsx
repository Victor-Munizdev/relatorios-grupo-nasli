import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, ArrowLeft, Wrench } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const NovoTipoServicoPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    ativo: true
  })

  const categorias = [
    "Manutenção",
    "Inspeção", 
    "Vistoria",
    "Reparo",
    "Análise",
    "Consultoria"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.categoria.trim()) {
      toast({
        title: "Erro",
        description: "Nome e categoria são obrigatórios.",
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
        description: "Tipo de serviço cadastrado com sucesso!",
      })
      
      navigate("/tipos-servicos")
    } catch (error) {
      console.error('Erro ao cadastrar tipo:', error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o tipo de serviço.",
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
          <Button variant="outline" onClick={() => navigate("/tipos-servicos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wrench className="h-8 w-8" />
              Cadastrar Novo Tipo de Serviço
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados do novo tipo de serviço
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Tipo de Serviço</CardTitle>
            <CardDescription>
              Informações do tipo de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Tipo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome do tipo de serviço"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descrição do tipo de serviço"
                  rows={4}
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

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Tipo"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/tipos-servicos")}>
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

export default NovoTipoServicoPage