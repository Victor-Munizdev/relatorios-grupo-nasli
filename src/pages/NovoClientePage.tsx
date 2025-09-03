import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, ArrowLeft, Building } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const NovoClientePage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    modelo_laudo: "",
    tipo_servico: "",
    categoria: ""
  })
  
  const [modeloLaudoOptions] = useState([
    "Vistoria Prévia",
    "Vistoria Cautelar", 
    "Vistoria de Transferência",
    "Vistoria de Sinistro"
  ])
  
  const [tipoServicoOptions] = useState([
    "Manutenção Preventiva",
    "Manutenção Corretiva",
    "Inspeção",
    "Reparo"
  ])
  
  const categoriaOptions = [
    "Pesado",
    "Leve", 
    "Reboque",
    "Semi-reboque",
    "Empilhadeira"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.categoria.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente e categoria são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('clientes')
        .insert([formData])

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      })
      
      navigate("/clientes")
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o cliente.",
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
          <Button variant="outline" onClick={() => navigate("/clientes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building className="h-8 w-8" />
              Cadastrar Novo Cliente
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados do novo cliente
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
            <CardDescription>
              Informações básicas e de contato do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cliente *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome do cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo_laudo">Modelo de Laudo</Label>
                  <Select value={formData.modelo_laudo} onValueChange={(value) => handleInputChange("modelo_laudo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione ou digite um modelo de laudo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {modeloLaudoOptions.map((modelo) => (
                        <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
                  <Select value={formData.tipo_servico} onValueChange={(value) => handleInputChange("tipo_servico", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione ou digite um tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {tipoServicoOptions.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {categoriaOptions.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Cliente"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/clientes")}>
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

export default NovoClientePage