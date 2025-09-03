import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Filter, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/DashboardLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Analista {
  id: string
  nome: string
  email: string
  especialidade?: string
  nivel?: string
  ativo: boolean
  created_at: string
}

const AnalistasPage = () => {
  const [analistas, setAnalistas] = useState<Analista[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchAnalistas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('analistas')
        .select('*')
        .order('nome')

      if (error) throw error
      setAnalistas(data || [])
    } catch (error) {
      console.error('Erro ao buscar analistas:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os analistas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o analista "${nome}"?`)) return

    try {
      const { error } = await supabase
        .from('analistas')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Analista excluído com sucesso!",
      })
      
      fetchAnalistas()
    } catch (error) {
      console.error('Erro ao excluir analista:', error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o analista.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAnalistas()
  }, [])

  const filteredAnalistas = analistas.filter(analista =>
    analista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analista.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNivelBadge = (nivel?: string) => {
    switch (nivel?.toLowerCase()) {
      case 'senior':
        return <Badge variant="default">Senior</Badge>
      case 'pleno':
        return <Badge variant="secondary">Pleno</Badge>
      case 'junior':
        return <Badge variant="outline">Junior</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando analistas...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">{/* ... keep existing code */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analistas</h1>
          <p className="text-muted-foreground">
            Gerencie os analistas do sistema
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Analista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Analistas</CardTitle>
          <CardDescription>
            Total de {analistas.length} analistas cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar analistas..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnalistas.map((analista) => (
                  <TableRow key={analista.id}>
                    <TableCell className="font-medium">{analista.nome}</TableCell>
                    <TableCell>{analista.email}</TableCell>
                    <TableCell>{analista.especialidade || '-'}</TableCell>
                    <TableCell>{getNivelBadge(analista.nivel)}</TableCell>
                    <TableCell>
                      <Badge variant={analista.ativo ? "default" : "secondary"}>
                        {analista.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(analista.id, analista.nome)}
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

          {filteredAnalistas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum analista encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  )
}

export default AnalistasPage