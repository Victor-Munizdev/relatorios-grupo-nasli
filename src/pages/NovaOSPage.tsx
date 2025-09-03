import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const NovaOSPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    numero_os: "",
    tipo_servico: "",
    descricao: "",
    cliente_id: "",
    analista_id: "",
    prioridade: "Normal",
    data_prazo: "",
    valor: ""
  })
  
  const [clientes, setClientes] = useState<Array<{id: string, nome: string}>>([])
  const [analistas, setAnalistas] = useState<Array<{id: string, nome: string}>>([])

  useEffect(() => {
    const fetchData = async () => {
      const [clientesRes, analistasRes] = await Promise.all([
        supabase.from('clientes').select('id, nome'),
        supabase.from('analistas').select('id, nome')
      ])
      
      if (clientesRes.data) setClientes(clientesRes.data)
      if (analistasRes.data) setAnalistas(analistasRes.data)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.numero_os.trim() || !formData.tipo_servico.trim()) {
      toast({
        title: "Erro",
        description: "Número da OS e tipo de serviço são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const osData = {
        ...formData,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        data_prazo: formData.data_prazo ? new Date(formData.data_prazo).toISOString() : null
      }

      const { error } = await supabase
        .from('ordens_servico')
        .insert([osData])

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Ordem de serviço criada com sucesso!",
      })
      
      navigate("/ordens-servico")
    } catch (error) {
      console.error('Erro ao criar OS:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a ordem de serviço.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/ordens-servico")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Nova Ordem de Serviço
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados da nova ordem de serviço
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da O.S.</CardTitle>
            <CardDescription>
              Informações da ordem de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="numero_os">Número da O.S. *</Label>
                  <Input
                    id="numero_os"
                    value={formData.numero_os}
                    onChange={(e) => handleInputChange("numero_os", e.target.value)}
                    placeholder="Digite o número da OS"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_servico">Tipo de Serviço *</Label>
                  <Input
                    id="tipo_servico"
                    value={formData.tipo_servico}
                    onChange={(e) => handleInputChange("tipo_servico", e.target.value)}
                    placeholder="Digite o tipo de serviço"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente_id">Cliente</Label>
                  <Select value={formData.cliente_id} onValueChange={(value) => handleInputChange("cliente_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analista_id">Analista</Label>
                  <Select value={formData.analista_id} onValueChange={(value) => handleInputChange("analista_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o analista" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {analistas.map((analista) => (
                        <SelectItem key={analista.id} value={analista.id}>{analista.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => handleInputChange("prioridade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_prazo">Data Prazo</Label>
                  <Input
                    id="data_prazo"
                    type="datetime-local"
                    value={formData.data_prazo}
                    onChange={(e) => handleInputChange("data_prazo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => handleInputChange("valor", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descrição detalhada do serviço"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar O.S."}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/ordens-servico")}>
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

export default NovaOSPage