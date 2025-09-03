import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Filter, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/DashboardLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Avaria {
  id: string
  tipo_avaria: string
  descricao: string
  gravidade: string
  status: string
  data_ocorrencia: string
  clientes?: { nome: string }
  ordens_servico?: { numero_os: string }
}

const AvariasPage = () => {
  const [avarias, setAvarias] = useState<Avaria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchAvarias = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('avarias')
        .select(`
          *,
          clientes:cliente_id (nome),
          ordens_servico:os_id (numero_os)
        `)
        .order('data_ocorrencia', { ascending: false })

      if (error) throw error
      setAvarias(data || [])
    } catch (error) {
      console.error('Erro ao buscar avarias:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avarias.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, tipoAvaria: string) => {
    if (!confirm(`Tem certeza que deseja excluir a avaria "${tipoAvaria}"?`)) return

    try {
      const { error } = await supabase
        .from('avarias')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Avaria excluída com sucesso!",
      })
      
      fetchAvarias()
    } catch (error) {
      console.error('Erro ao excluir avaria:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a avaria.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAvarias()
  }, [])

  const filteredAvarias = avarias.filter(avaria =>
    avaria.tipo_avaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avaria.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    avaria.clientes?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fechada':
        return <Badge variant="default">Fechada</Badge>
      case 'aberta':
        return <Badge variant="destructive">Aberta</Badge>
      case 'em análise':
        return <Badge variant="secondary">Em Análise</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGravidadeBadge = (gravidade: string) => {
    switch (gravidade.toLowerCase()) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'média':
        return <Badge variant="secondary">Média</Badge>
      case 'baixa':
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">{gravidade}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando avarias...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">{/* ... keep existing code */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Avarias</h1>
          <p className="text-muted-foreground">
            Gerencie as avarias do sistema
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Avaria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Avarias</CardTitle>
          <CardDescription>
            Total de {avarias.length} avarias cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar avarias..."
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
                  <TableHead>Tipo de Avaria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>O.S. Relacionada</TableHead>
                  <TableHead>Gravidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Ocorrência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAvarias.map((avaria) => (
                  <TableRow key={avaria.id}>
                    <TableCell className="font-medium">{avaria.tipo_avaria}</TableCell>
                    <TableCell className="max-w-xs truncate">{avaria.descricao}</TableCell>
                    <TableCell>{avaria.clientes?.nome || '-'}</TableCell>
                    <TableCell className="font-mono">{avaria.ordens_servico?.numero_os || '-'}</TableCell>
                    <TableCell>{getGravidadeBadge(avaria.gravidade)}</TableCell>
                    <TableCell>{getStatusBadge(avaria.status)}</TableCell>
                    <TableCell>
                      {format(new Date(avaria.data_ocorrencia), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(avaria.id, avaria.tipo_avaria)}
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

          {filteredAvarias.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma avaria encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  )
}

export default AvariasPage