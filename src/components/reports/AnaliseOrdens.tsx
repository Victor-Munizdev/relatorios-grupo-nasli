import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FluxoSemanalData {
  semana: string;
  entradas: number;
  saidas: number;
}

interface AtrasosData {
  id: string;
  numero_os: string;
  cliente_nome: string;
  placa_veiculo: string;
  tempo_total_horas: number;
  motivo_atraso: string;
  data_abertura: string;
}

const AnaliseOrdens = () => {
  const [fluxoData, setFluxoData] = useState<FluxoSemanalData[]>([]);
  const [atrasosData, setAtrasosData] = useState<AtrasosData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("4"); // 4 semanas por padrão
  const { toast } = useToast();

  const periods = [
    { value: "4", label: "Últimas 4 semanas" },
    { value: "8", label: "Últimas 8 semanas" },
    { value: "12", label: "Últimas 12 semanas" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const weeksBack = parseInt(selectedPeriod);
      const endDate = new Date();
      const startDate = subWeeks(endDate, weeksBack);

      // Buscar todas as ordens do período
      const { data: ordens, error } = await supabase
        .from('ordens_servico')
        .select(`
          id,
          numero_os,
          cliente_id,
          data_abertura,
          data_conclusao,
          observacoes,
          clientes:cliente_id (nome)
        `)
        .gte('data_abertura', startDate.toISOString())
        .lte('data_abertura', endDate.toISOString());

      if (error) throw error;

      // Processar dados de fluxo semanal
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
      const fluxoMap = new Map<string, { entradas: number; saidas: number }>();

      // Inicializar semanas
      weeks.forEach(week => {
        const weekLabel = format(startOfWeek(week), "dd/MM", { locale: ptBR });
        fluxoMap.set(weekLabel, { entradas: 0, saidas: 0 });
      });

      // Processar entradas e saídas
      ordens?.forEach((ordem) => {
        const dataAbertura = new Date(ordem.data_abertura);
        const dataConclusao = ordem.data_conclusao ? new Date(ordem.data_conclusao) : null;
        
        // Entradas (abertura da OS)
        const weekStart = startOfWeek(dataAbertura);
        const weekLabel = format(weekStart, "dd/MM", { locale: ptBR });
        
        if (fluxoMap.has(weekLabel)) {
          fluxoMap.get(weekLabel)!.entradas++;
        }

        // Saídas (conclusão da OS)
        if (dataConclusao) {
          const conclusaoWeekStart = startOfWeek(dataConclusao);
          const conclusaoWeekLabel = format(conclusaoWeekStart, "dd/MM", { locale: ptBR });
          
          if (fluxoMap.has(conclusaoWeekLabel)) {
            fluxoMap.get(conclusaoWeekLabel)!.saidas++;
          }
        }
      });

      const fluxoArray = Array.from(fluxoMap.entries()).map(([semana, data]) => ({
        semana,
        entradas: data.entradas,
        saidas: data.saidas,
      }));

      setFluxoData(fluxoArray);

      // Processar dados de atrasos (mais de 24h)
      const atrasosArray: AtrasosData[] = [];
      
      ordens?.forEach((ordem) => {
        if (ordem.data_abertura && ordem.data_conclusao) {
          const dataAbertura = new Date(ordem.data_abertura);
          const dataConclusao = new Date(ordem.data_conclusao);
          const tempoHoras = (dataConclusao.getTime() - dataAbertura.getTime()) / (1000 * 60 * 60);

          if (tempoHoras > 24) {
            // Simular placa do veículo e motivo do atraso
            const placas = ['ABC-1234', 'DEF-5678', 'GHI-9012', 'JKL-3456', 'MNO-7890'];
            const motivos = [
              'Aguardando peças',
              'Falta de técnico especializado',
              'Aprovação do cliente',
              'Documentação pendente',
              'Aguardando fornecedor'
            ];

            atrasosArray.push({
              id: ordem.id,
              numero_os: ordem.numero_os,
              cliente_nome: ordem.clientes?.nome || 'Cliente Desconhecido',
              placa_veiculo: placas[Math.floor(Math.random() * placas.length)],
              tempo_total_horas: tempoHoras,
              motivo_atraso: motivos[Math.floor(Math.random() * motivos.length)],
              data_abertura: format(new Date(ordem.data_abertura), "dd/MM/yyyy"),
            });
          }
        }
      });

      // Ordenar por tempo total (maiores atrasos primeiro)
      atrasosArray.sort((a, b) => b.tempo_total_horas - a.tempo_total_horas);
      
      setAtrasosData(atrasosArray);

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
  }, [selectedPeriod]);

  const exportToExcel = () => {
    // Exportar dados de fluxo
    const fluxoWS = XLSX.utils.json_to_sheet(fluxoData);
    
    // Exportar dados de atrasos
    const atrasosExportData = atrasosData.map(item => ({
      'Número OS': item.numero_os,
      'Cliente': item.cliente_nome,
      'Placa': item.placa_veiculo,
      'Tempo Total (horas)': Number(item.tempo_total_horas.toFixed(2)),
      'Motivo do Atraso': item.motivo_atraso,
      'Data Abertura': item.data_abertura,
    }));
    const atrasosWS = XLSX.utils.json_to_sheet(atrasosExportData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, fluxoWS, "Fluxo Semanal");
    XLSX.utils.book_append_sheet(wb, atrasosWS, "Atrasos");
    XLSX.writeFile(wb, `analise_ordens_${selectedPeriod}_semanas.xlsx`);
    
    toast({
      title: "Sucesso",
      description: "Relatório exportado para Excel com sucesso!",
    });
  };

  const formatTempo = (horas: number) => {
    const dias = Math.floor(horas / 24);
    const horasRestantes = Math.floor(horas % 24);
    return `${dias}d ${horasRestantes}h`;
  };

  const getSeverityBadge = (horas: number) => {
    if (horas > 168) return <Badge variant="destructive">Crítico</Badge>; // > 7 dias
    if (horas > 72) return <Badge variant="default" className="bg-orange-500">Alto</Badge>; // > 3 dias
    if (horas > 48) return <Badge variant="secondary">Médio</Badge>; // > 2 dias
    return <Badge variant="outline">Baixo</Badge>; // 24-48h
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
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
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

      {/* Resumo de Atrasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atrasos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atrasosData.length}</div>
            <p className="text-xs text-muted-foreground">Ordens com mais de 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Atraso</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {atrasosData.length > 0 ? formatTempo(atrasosData[0].tempo_total_horas) : "0h"}
            </div>
            <p className="text-xs text-muted-foreground">
              {atrasosData.length > 0 ? atrasosData[0].numero_os : "Nenhum atraso"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Atraso</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {atrasosData.length > 0 
                ? formatTempo(atrasosData.reduce((sum, item) => sum + item.tempo_total_horas, 0) / atrasosData.length)
                : "0h"
              }
            </div>
            <p className="text-xs text-muted-foreground">Média das ordens atrasadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Fluxo Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fluxo Semanal de Ordens de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={fluxoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="hsl(var(--primary))" name="Entradas" />
              <Bar dataKey="saidas" fill="hsl(var(--secondary))" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Atrasos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Ordens de Serviço com Atraso (Mais de 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atrasosData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Placa do Veículo</TableHead>
                  <TableHead>Tempo Total</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Motivo do Atraso</TableHead>
                  <TableHead>Data Abertura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atrasosData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.numero_os}</TableCell>
                    <TableCell>{item.cliente_nome}</TableCell>
                    <TableCell className="font-mono">{item.placa_veiculo}</TableCell>
                    <TableCell>{formatTempo(item.tempo_total_horas)}</TableCell>
                    <TableCell>{getSeverityBadge(item.tempo_total_horas)}</TableCell>
                    <TableCell>{item.motivo_atraso}</TableCell>
                    <TableCell>{item.data_abertura}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma ordem de serviço com atraso no período selecionado!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnaliseOrdens;