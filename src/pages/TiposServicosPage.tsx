import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Filter, Wrench } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/DashboardLayout"
import { useToast } from "@/hooks/use-toast"

interface TipoServico {
  id: string
  nome: string
  descricao: string
  categoria: string
  ativo: boolean
  created_at: string
}

const TiposServicosPage = () => {
  const [tipos, setTipos] = useState<TipoServico[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingType, setEditingType] = useState<TipoServico | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  // Dados simulados para demonstração
  const tiposSimulados: TipoServico[] = [
    {
      id: "1",
      nome: "Manutenção Preventiva",
      descricao: "Serviços de manutenção preventiva regular",
      categoria: "Manutenção",
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: "2", 
      nome: "Manutenção Corretiva",
      descricao: "Serviços de reparo e correção de problemas",
      categoria: "Manutenção",
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      nome: "Inspeção Técnica",
      descricao: "Inspeções técnicas detalhadas",
      categoria: "Inspeção",
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      nome: "Vistoria de Sinistro",
      descricao: "Vistoria para casos de sinistro",
      categoria: "Vistoria",
      ativo: false,
      created_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true)
    setTimeout(() => {
      setTipos(tiposSimulados)
      setLoading(false)
    }, 500)
  }, [])

  const handleEdit = (tipo: TipoServico) => {
    setEditingType({ ...tipo })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingType) return

    setTipos(prev => prev.map(t => 
      t.id === editingType.id ? editingType : t
    ))
    
    toast({
      title: "Sucesso",
      description: "Tipo de serviço atualizado com sucesso!",
    })
    
    setIsEditDialogOpen(false)
    setEditingType(null)
  }

  const handleDelete = (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o tipo "${nome}"?`)) return

    setTipos(prev => prev.filter(t => t.id !== id))
    
    toast({
      title: "Sucesso",
      description: "Tipo de serviço excluído com sucesso!",
    })
  }

  const handleToggleStatus = (id: string) => {
    setTipos(prev => prev.map(t => 
      t.id === id ? { ...t, ativo: !t.ativo } : t
    ))
    
    toast({
      title: "Sucesso",
      description: "Status do tipo atualizado!",
    })
  }

  const filteredTipos = tipos.filter(tipo =>
    tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoriaColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'manutenção':
        return 'bg-blue-100 text-blue-800'
      case 'inspeção':
        return 'bg-green-100 text-green-800'
      case 'vistoria':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Carregando tipos de serviços...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wrench className="h-8 w-8" />
              Tipos de Serviços
            </h1>
            <p className="text-muted-foreground">
              Gerencie os tipos de serviços do sistema
            </p>
          </div>
          <Button onClick={() => window.location.href = "/tipos-servicos/novo"} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Tipo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tipos de Serviços</CardTitle>
            <CardDescription>
              Total de {tipos.length} tipos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tipos..."
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
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTipos.map((tipo) => (
                    <TableRow key={tipo.id}>
                      <TableCell className="font-medium">{tipo.nome}</TableCell>
                      <TableCell className="max-w-xs truncate">{tipo.descricao}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(tipo.categoria)}`}>
                          {tipo.categoria}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={tipo.ativo ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(tipo.id)}
                        >
                          {tipo.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(tipo.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(tipo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(tipo.id, tipo.nome)}
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

            {filteredTipos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum tipo de serviço encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Tipo de Serviço</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias no tipo de serviço.
              </DialogDescription>
            </DialogHeader>
            
            {editingType && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nome">Nome</Label>
                  <Input
                    id="edit-nome"
                    value={editingType.nome}
                    onChange={(e) => setEditingType(prev => prev ? { ...prev, nome: e.target.value } : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-descricao">Descrição</Label>
                  <Textarea
                    id="edit-descricao"
                    value={editingType.descricao}
                    onChange={(e) => setEditingType(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-categoria">Categoria</Label>
                  <Input
                    id="edit-categoria"
                    value={editingType.categoria}
                    onChange={(e) => setEditingType(prev => prev ? { ...prev, categoria: e.target.value } : null)}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

export default TiposServicosPage