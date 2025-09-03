import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const NovaAvariaPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipo_avaria: "",
    descricao: "",
    cliente_id: "",
    os_id: "",
    gravidade: "Média",
    data_ocorrencia: ""
  })
  
  const [clientes, setClientes] = useState<Array<{id: string, nome: string}>>([])
  const [ordensServico, setOrdensServico] = useState<Array<{id: string, numero_os: string}>>([])

  useEffect(() => {
    const fetchData = async () => {
      const [clientesRes, osRes] = await Promise.all([
        supabase.from('clientes').select('id, nome'),
        supabase.from('ordens_servico').select('id, numero_os')
      ])
      
      if (clientesRes.data) setClientes(clientesRes.data)
      if (osRes.data) setOrdensServico(osRes.data)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.tipo_avaria.trim() || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Tipo de avaria e descrição são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const avariaData = {
        ...formData,
        data_ocorrencia: formData.data_ocorrencia ? new Date(formData.data_ocorrencia).toISOString() : new Date().toISOString()
      }

      const { error } = await supabase
        .from('avarias')
        .insert([avariaData])

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Avaria registrada com sucesso!",
      })
      
      navigate("/avarias")
    } catch (error) {
      console.error('Erro ao registrar avaria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar a avaria.",
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
          <Button variant="outline" onClick={() => navigate("/avarias")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-8 w-8" />
              Registrar Nova Avaria
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados da nova avaria
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Avaria</CardTitle>
            <CardDescription>
              Informações sobre a avaria identificada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tipo_avaria">Tipo de Avaria *</Label>
                  <Input
                    id="tipo_avaria"
                    value={formData.tipo_avaria}
                    onChange={(e) => handleInputChange("tipo_avaria", e.target.value)}
                    placeholder="Digite o tipo de avaria"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gravidade">Gravidade</Label>
                  <Select value={formData.gravidade} onValueChange={(value) => handleInputChange("gravidade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a gravidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="os_id">Ordem de Serviço</Label>
                  <Select value={formData.os_id} onValueChange={(value) => handleInputChange("os_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a O.S." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {ordensServico.map((os) => (
                        <SelectItem key={os.id} value={os.id}>{os.numero_os}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_ocorrencia">Data da Ocorrência</Label>
                  <Input
                    id="data_ocorrencia"
                    type="datetime-local"
                    value={formData.data_ocorrencia}
                    onChange={(e) => handleInputChange("data_ocorrencia", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descrição detalhada da avaria"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Avaria"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/avarias")}>
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

export default NovaAvariaPage