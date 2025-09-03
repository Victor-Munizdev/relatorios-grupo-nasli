import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Filter, FileText, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/DashboardLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface OrdemServico {
  id: string
  numero_os: string
  tipo_servico: string
  descricao?: string
  status: string
  prioridade: string
  data_abertura: string
  data_prazo?: string
  data_conclusao?: string
  valor?: number
  clientes?: { nome: string }
  analistas?: { nome: string }
}

const OrdensServicoPage = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchOrdens = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          clientes:cliente_id (nome),
          analistas:analista_id (nome)
        `)
        .order('data_abertura', { ascending: false })

      if (error) throw error
      setOrdens(data || [])
    } catch (error) {
      console.error('Erro ao buscar ordens:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ordens de serviço.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, numeroOS: string) => {
    if (!confirm(`Tem certeza que deseja excluir a O.S. "${numeroOS}"?`)) return

    try {
      const { error } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Ordem de serviço excluída com sucesso!",
      })
      
      fetchOrdens()
    } catch (error) {
      console.error('Erro ao excluir ordem:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a ordem de serviço.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchOrdens()
  }, [])

  const filteredOrdens = ordens.filter(ordem =>
    ordem.numero_os.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ordem.tipo_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ordem.clientes?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ordem.analistas?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
        return <Badge variant="default">Concluída</Badge>
      case 'em andamento':
        return <Badge variant="secondary">Em Andamento</Badge>
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'média':
        return <Badge variant="secondary">Média</Badge>
      case 'baixa':
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">{prioridade}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando ordens de serviço...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">{/* ... keep existing code */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerencie as ordens de serviço do sistema
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova O.S.
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
          <CardDescription>
            Total de {ordens.length} ordens de serviço cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ordens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número O.S.</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Analista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdens.map((ordem) => (
                  <TableRow key={ordem.id}>
                    <TableCell className="font-medium font-mono">{ordem.numero_os}</TableCell>
                    <TableCell>{ordem.tipo_servico}</TableCell>
                    <TableCell>{ordem.clientes?.nome || '-'}</TableCell>
                    <TableCell>{ordem.analistas?.nome || '-'}</TableCell>
                    <TableCell>{getStatusBadge(ordem.status)}</TableCell>
                    <TableCell>{getPrioridadeBadge(ordem.prioridade)}</TableCell>
                    <TableCell>
                      {format(new Date(ordem.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(ordem.id, ordem.numero_os)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrdens.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma ordem de serviço encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  )
}

export default OrdensServicoPage