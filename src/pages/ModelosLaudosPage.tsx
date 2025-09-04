import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Filter, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/DashboardLayout"
import { useToast } from "@/hooks/use-toast"

interface ModeloLaudo {
  id: string
  nome: string
  descricao: string
  template: string
  ativo: boolean
  created_at: string
}

const ModelosLaudosPage = () => {
  const [modelos, setModelos] = useState<ModeloLaudo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingModel, setEditingModel] = useState<ModeloLaudo | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  // Dados simulados para demonstração
  const modelosSimulados: ModeloLaudo[] = [
    {
      id: "1",
      nome: "Vistoria Prévia",
      descricao: "Modelo padrão para vistorias prévias de veículos",
      template: "Template básico com campos obrigatórios para vistoria prévia",
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: "2", 
      nome: "Vistoria Cautelar",
      descricao: "Modelo para vistorias cautelares em casos especiais",
      template: "Template específico para vistorias cautelares com campos adicionais",
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      nome: "Vistoria de Transferência",
      descricao: "Modelo para vistorias de transferência de propriedade",
      template: "Template para transferência com validações específicas",
      ativo: false,
      created_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true)
    setTimeout(() => {
      setModelos(modelosSimulados)
      setLoading(false)
    }, 500)
  }, [])

  const handleEdit = (modelo: ModeloLaudo) => {
    setEditingModel({ ...modelo })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingModel) return

    setModelos(prev => prev.map(m => 
      m.id === editingModel.id ? editingModel : m
    ))
    
    toast({
      title: "Sucesso",
      description: "Modelo de laudo atualizado com sucesso!",
    })
    
    setIsEditDialogOpen(false)
    setEditingModel(null)
  }

  const handleDelete = (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o modelo "${nome}"?`)) return

    setModelos(prev => prev.filter(m => m.id !== id))
    
    toast({
      title: "Sucesso",
      description: "Modelo de laudo excluído com sucesso!",
    })
  }

  const handleToggleStatus = (id: string) => {
    setModelos(prev => prev.map(m => 
      m.id === id ? { ...m, ativo: !m.ativo } : m
    ))
    
    toast({
      title: "Sucesso",
      description: "Status do modelo atualizado!",
    })
  }

  const filteredModelos = modelos.filter(modelo =>
    modelo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    modelo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Carregando modelos de laudos...</div>
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
              <BookOpen className="h-8 w-8" />
              Modelos de Laudos
            </h1>
            <p className="text-muted-foreground">
              Gerencie os modelos de laudos do sistema
            </p>
          </div>
          <Button onClick={() => window.location.href = "/modelos-laudos/novo"} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Modelo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Modelos de Laudos</CardTitle>
            <CardDescription>
              Total de {modelos.length} modelos cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar modelos..."
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
                    <TableHead>Status</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModelos.map((modelo) => (
                    <TableRow key={modelo.id}>
                      <TableCell className="font-medium">{modelo.nome}</TableCell>
                      <TableCell className="max-w-xs truncate">{modelo.descricao}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={modelo.ativo ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleStatus(modelo.id)}
                        >
                          {modelo.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(modelo.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(modelo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(modelo.id, modelo.nome)}
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

            {filteredModelos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum modelo de laudo encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Modelo de Laudo</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias no modelo de laudo.
              </DialogDescription>
            </DialogHeader>
            
            {editingModel && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nome">Nome</Label>
                  <Input
                    id="edit-nome"
                    value={editingModel.nome}
                    onChange={(e) => setEditingModel(prev => prev ? { ...prev, nome: e.target.value } : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-descricao">Descrição</Label>
                  <Textarea
                    id="edit-descricao"
                    value={editingModel.descricao}
                    onChange={(e) => setEditingModel(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-template">Template</Label>
                  <Textarea
                    id="edit-template"
                    value={editingModel.template}
                    onChange={(e) => setEditingModel(prev => prev ? { ...prev, template: e.target.value } : null)}
                    rows={5}
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

export default ModelosLaudosPage