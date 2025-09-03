import { useState } from "react"
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
    gravidade: "",
    data_ocorrencia: "",
    valor_liquido: "",
    valor_bruto: "",
    valor_terceiros: ""
  })
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar se pelo menos um campo obrigatório está preenchido
    if (!formData.tipo_avaria.trim()) {
      toast({
        title: "Erro",
        description: "Tipo de avaria é obrigatório.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const avariaData = {
        ...formData,
        data_ocorrencia: formData.data_ocorrencia ? new Date(formData.data_ocorrencia).toISOString() : new Date().toISOString(),
        valor_liquido: formData.valor_liquido ? parseFloat(formData.valor_liquido) : null,
        valor_bruto: formData.valor_bruto ? parseFloat(formData.valor_bruto) : null,
        valor_terceiros: formData.valor_terceiros ? parseFloat(formData.valor_terceiros) : null
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
                      <SelectItem value="Muito baixa">Muito baixa</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Muito alta">Muito alta</SelectItem>
                      <SelectItem value="Grave">Grave</SelectItem>
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

                <div className="space-y-2">
                  <Label htmlFor="valor_liquido">Valor Líquido</Label>
                  <Input
                    id="valor_liquido"
                    type="number"
                    step="0.01"
                    value={formData.valor_liquido}
                    onChange={(e) => handleInputChange("valor_liquido", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_bruto">Valor Bruto</Label>
                  <Input
                    id="valor_bruto"
                    type="number"
                    step="0.01"
                    value={formData.valor_bruto}
                    onChange={(e) => handleInputChange("valor_bruto", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_terceiros">Valor de Terceiros</Label>
                  <Input
                    id="valor_terceiros"
                    type="number"
                    step="0.01"
                    value={formData.valor_terceiros}
                    onChange={(e) => handleInputChange("valor_terceiros", e.target.value)}
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
                  placeholder="Descrição detalhada da avaria"
                  rows={4}
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