import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Filter, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface SLAData {
  analista_nome: string;
  cliente_nome: string;
  total_vistorias: number;
  tempo_medio_horas: number;
  tempo_total_horas: number;
}

const ProdutividadeAnalistas = () => {
  const [data, setData] = useState<SLAData[]>([]);
  const [clientes, setClientes] = useState<string[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar ordens de serviço com data de abertura e conclusão
      const { data: ordens, error } = await supabase
        .from('ordens_servico')
        .select(`
          id,
          analista_id,
          cliente_id,
          data_abertura,
          data_conclusao,
          analistas:analista_id (nome),
          clientes:cliente_id (nome)
        `)
        .gte('data_abertura', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data_abertura', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`)
        .not('data_conclusao', 'is', null); // Apenas ordens concluídas

      if (error) throw error;

      // Processar dados para calcular SLA
      const slaMap = new Map<string, SLAData>();
      const clientesSet = new Set<string>();

      ordens?.forEach((ordem) => {
        const analistaNome = ordem.analistas?.nome || 'Analista Desconhecido';
        const clienteNome = ordem.clientes?.nome || 'Cliente Desconhecido';
        
        clientesSet.add(clienteNome);

        if (ordem.data_abertura && ordem.data_conclusao) {
          const dataAbertura = new Date(ordem.data_abertura);
          const dataConclusao = new Date(ordem.data_conclusao);
          const tempoHoras = (dataConclusao.getTime() - dataAbertura.getTime()) / (1000 * 60 * 60);

          const key = `${analistaNome}-${clienteNome}`;
          
          if (!slaMap.has(key)) {
            slaMap.set(key, {
              analista_nome: analistaNome,
              cliente_nome: clienteNome,
              total_vistorias: 0,
              tempo_medio_horas: 0,
              tempo_total_horas: 0,
            });
          }

          const slaData = slaMap.get(key)!;
          slaData.total_vistorias++;
          slaData.tempo_total_horas += tempoHoras;
          slaData.tempo_medio_horas = slaData.tempo_total_horas / slaData.total_vistorias;
        }
      });

      const clientesArray = Array.from(clientesSet).sort();
      setClientes(clientesArray);

      // Converter para array e filtrar por cliente se selecionado
      let processedData = Array.from(slaMap.values());
      
      if (selectedCliente !== "todos") {
        processedData = processedData.filter(item => item.cliente_nome === selectedCliente);
      }

      // Ordenar por tempo médio (melhor SLA primeiro)
      processedData.sort((a, b) => a.tempo_medio_horas - b.tempo_medio_horas);

      setData(processedData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do relatório.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedCliente]);

  const exportToExcel = () => {
    const exportData = data.map(item => ({
      'Analista': item.analista_nome,
      'Cliente': item.cliente_nome,
      'Total de Vistorias': item.total_vistorias,
      'Tempo Médio (horas)': Number(item.tempo_medio_horas.toFixed(2)),
      'Tempo Total (horas)': Number(item.tempo_total_horas.toFixed(2)),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SLA Analistas");
    XLSX.writeFile(wb, `sla_analistas_${selectedYear}_${selectedMonth}.xlsx`);
    
    toast({
      title: "Sucesso",
      description: "Relatório exportado para Excel com sucesso!",
    });
  };

  const formatTempo = (horas: number) => {
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);
    return `${horasInteiras}h ${minutos}m`;
  };

  const getChartData = () => {
    if (selectedCliente === "todos") {
      // Agrupar por analista quando "todos" estiver selecionado
      const analistaMap = new Map<string, { total_vistorias: number; tempo_total: number }>();
      
      data.forEach(item => {
        if (!analistaMap.has(item.analista_nome)) {
          analistaMap.set(item.analista_nome, { total_vistorias: 0, tempo_total: 0 });
        }
        const analistaData = analistaMap.get(item.analista_nome)!;
        analistaData.total_vistorias += item.total_vistorias;
        analistaData.tempo_total += item.tempo_total_horas;
      });

      return Array.from(analistaMap.entries()).map(([nome, data]) => ({
        nome,
        tempo_medio: data.tempo_total / data.total_vistorias || 0,
        total_vistorias: data.total_vistorias,
      }));
    } else {
      return data.map(item => ({
        nome: item.analista_nome,
        tempo_medio: item.tempo_medio_horas,
        total_vistorias: item.total_vistorias,
      }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCliente} onValueChange={setSelectedCliente}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Clientes</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente} value={cliente}>
                    {cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de SLA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tempo Médio de SLA por Analista
            {selectedCliente !== "todos" && ` - ${selectedCliente}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [formatTempo(value), 'Tempo Médio']}
                labelFormatter={(label) => `Analista: ${label}`}
              />
              <Legend />
              <Bar dataKey="tempo_medio" fill="hsl(var(--primary))" name="Tempo Médio (horas)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Detalhamento de SLA por Analista e Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Analista</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Total de Vistorias</TableHead>
                <TableHead className="text-center">Tempo Médio</TableHead>
                <TableHead className="text-center">Tempo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.analista_nome}</TableCell>
                  <TableCell>{item.cliente_nome}</TableCell>
                  <TableCell className="text-center">{item.total_vistorias}</TableCell>
                  <TableCell className="text-center">{formatTempo(item.tempo_medio_horas)}</TableCell>
                  <TableCell className="text-center">{formatTempo(item.tempo_total_horas)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProdutividadeAnalistas;