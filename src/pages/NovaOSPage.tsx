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
    placa: "",
    tipo_servico: "",
    descricao: "",
    cliente_id: "",
    analista_id: "",
    local_vistoria: "Novas vistorias"
  })
  
  const [enableTipoServico, setEnableTipoServico] = useState(false)
  
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
    
    if (!formData.placa.trim()) {
      toast({
        title: "Erro",
        description: "Placa é obrigatória.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const osData = {
        numero_os: `OS-${Date.now()}`, // Gerar número automático
        ...formData
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
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    value={formData.placa}
                    onChange={(e) => handleInputChange("placa", e.target.value)}
                    placeholder="Digite a placa do veículo"
                    required
                  />
                </div>

                <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable_tipo_servico"
                    checked={enableTipoServico}
                    onChange={(e) => setEnableTipoServico(e.target.checked)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <Label htmlFor="enable_tipo_servico">Habilitar Tipo de Serviço</Label>
                </div>
                  {(enableTipoServico || formData.cliente_id) && (
                    <>
                      <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
                      <Input
                        id="tipo_servico"
                        value={formData.tipo_servico}
                        onChange={(e) => handleInputChange("tipo_servico", e.target.value)}
                        placeholder="Digite o tipo de serviço"
                      />
                    </>
                  )}
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
                  <Label htmlFor="local_vistoria">Local da Vistoria</Label>
                  <Select value={formData.local_vistoria} onValueChange={(value) => handleInputChange("local_vistoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Novas vistorias">Novas vistorias</SelectItem>
                      <SelectItem value="Ordens de serviços">Ordens de serviços</SelectItem>
                      <SelectItem value="Mesa de análise">Mesa de análise</SelectItem>
                      <SelectItem value="Finalizados">Finalizados</SelectItem>
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