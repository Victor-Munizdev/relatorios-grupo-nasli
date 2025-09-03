import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Save, ArrowLeft, UserCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const NovoAnalistaPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    clientes_atendidos: [] as string[]
  })
  
  const [clientes, setClientes] = useState<Array<{id: string, nome: string}>>([])
  const [clienteInput, setClienteInput] = useState("")

  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase.from('clientes').select('id, nome')
      if (data) setClientes(data)
    }
    fetchClientes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('analistas')
        .insert([formData])

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Analista cadastrado com sucesso!",
      })
      
      navigate("/analistas")
    } catch (error) {
      console.error('Erro ao cadastrar analista:', error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o analista.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const adicionarCliente = (clienteNome: string) => {
    if (clienteNome && !formData.clientes_atendidos.includes(clienteNome)) {
      setFormData(prev => ({ 
        ...prev, 
        clientes_atendidos: [...prev.clientes_atendidos, clienteNome] 
      }))
    }
    setClienteInput("")
  }

  const removerCliente = (clienteNome: string) => {
    setFormData(prev => ({ 
      ...prev, 
      clientes_atendidos: prev.clientes_atendidos.filter(c => c !== clienteNome) 
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/analistas")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCheck className="h-8 w-8" />
              Cadastrar Novo Analista
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados do novo analista
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Analista</CardTitle>
            <CardDescription>
              Informações profissionais do analista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clientes que Atende</Label>
                  <div className="flex gap-2">
                    <Select value={clienteInput} onValueChange={setClienteInput}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione ou digite um cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.nome}>{cliente.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => adicionarCliente(clienteInput)}
                      disabled={!clienteInput}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <Input
                    placeholder="Ou digite o nome de um novo cliente"
                    value={clienteInput}
                    onChange={(e) => setClienteInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarCliente(clienteInput))}
                  />
                  {formData.clientes_atendidos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.clientes_atendidos.map((cliente) => (
                        <Badge key={cliente} variant="secondary" className="flex items-center gap-1">
                          {cliente}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removerCliente(cliente)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Analista"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/analistas")}>
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

export default NovoAnalistaPage