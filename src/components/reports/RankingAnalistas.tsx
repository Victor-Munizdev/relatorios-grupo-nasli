import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface RankingData {
  analista_nome: string;
  clientes: { [clienteNome: string]: number };
  total: number;
  posicao: number;
}

const RankingAnalistas = () => {
  const [data, setData] = useState<RankingData[]>([]);
  const [clientes, setClientes] = useState<string[]>([]);
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

  const getRankIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{posicao}</span>;
    }
  };

  const getRankBadge = (posicao: number) => {
    if (posicao === 1) return <Badge variant="default" className="bg-yellow-500">1º Lugar</Badge>;
    if (posicao === 2) return <Badge variant="secondary">2º Lugar</Badge>;
    if (posicao === 3) return <Badge variant="outline">3º Lugar</Badge>;
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar ordens de serviço do período com dados do analista e cliente
      const { data: ordens, error } = await supabase
        .from('ordens_servico')
        .select(`
          id,
          analista_id,
          cliente_id,
          data_abertura,
          analistas:analista_id (nome),
          clientes:cliente_id (nome)
        `)
        .gte('data_abertura', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data_abertura', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`);

      if (error) throw error;

      // Processar dados para criar o ranking
      const analistaMap = new Map<string, { clientes: Map<string, number>; total: number }>();
      const clientesSet = new Set<string>();

      ordens?.forEach((ordem) => {
        const analistaNome = ordem.analistas?.nome || 'Analista Desconhecido';
        const clienteNome = ordem.clientes?.nome || 'Cliente Desconhecido';
        
        clientesSet.add(clienteNome);

        if (!analistaMap.has(analistaNome)) {
          analistaMap.set(analistaNome, {
            clientes: new Map<string, number>(),
            total: 0
          });
        }

        const analistaData = analistaMap.get(analistaNome)!;
        analistaData.clientes.set(clienteNome, (analistaData.clientes.get(clienteNome) || 0) + 1);
        analistaData.total++;
      });

      const clientesArray = Array.from(clientesSet).sort();
      setClientes(clientesArray);

      // Converter para formato do componente e ordenar por total
      const processedData = Array.from(analistaMap.entries())
        .map(([analistaNome, data]) => {
          const clientesObj: { [clienteNome: string]: number } = {};
          clientesArray.forEach(cliente => {
            clientesObj[cliente] = data.clientes.get(cliente) || 0;
          });

          return {
            analista_nome: analistaNome,
            clientes: clientesObj,
            total: data.total,
            posicao: 0 // Será definido após ordenação
          };
        })
        .sort((a, b) => b.total - a.total)
        .map((item, index) => ({
          ...item,
          posicao: index + 1
        }));

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
  }, [selectedMonth, selectedYear]);

  const exportToExcel = () => {
    // Preparar dados para exportação
    const exportData = data.map(item => {
      const row: any = {
        'Posição': item.posicao,
        'Analista': item.analista_nome,
        ...item.clientes,
        'Total': item.total
      };
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ranking Analistas");
    XLSX.writeFile(wb, `ranking_analistas_${selectedYear}_${selectedMonth}.xlsx`);
    
    toast({
      title: "Sucesso",
      description: "Relatório exportado para Excel com sucesso!",
    });
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

            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Podium dos Top 3 */}
      {data.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 3 Analistas do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end gap-8">
              {/* 2º Lugar */}
              <div className="text-center">
                <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-end justify-center mb-2">
                  <Medal className="h-8 w-8 text-gray-400 mb-2" />
                </div>
                <p className="font-semibold">{data[1]?.analista_nome}</p>
                <p className="text-sm text-muted-foreground">{data[1]?.total} vistorias</p>
              </div>

              {/* 1º Lugar */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-200 rounded-t-lg flex items-end justify-center mb-2">
                  <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
                </div>
                <p className="font-bold text-lg">{data[0]?.analista_nome}</p>
                <p className="text-sm text-muted-foreground">{data[0]?.total} vistorias</p>
              </div>

              {/* 3º Lugar */}
              <div className="text-center">
                <div className="w-20 h-12 bg-amber-100 rounded-t-lg flex items-end justify-center mb-2">
                  <Award className="h-6 w-6 text-amber-600 mb-2" />
                </div>
                <p className="font-semibold">{data[2]?.analista_nome}</p>
                <p className="text-sm text-muted-foreground">{data[2]?.total} vistorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Completo - Vistorias por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Posição</TableHead>
                  <TableHead>Analista</TableHead>
                  {clientes.map((cliente) => (
                    <TableHead key={cliente} className="text-center min-w-24">
                      {cliente}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.analista_nome} className={item.posicao <= 3 ? "bg-muted/50" : ""}>
                    <TableCell className="flex items-center gap-2">
                      {getRankIcon(item.posicao)}
                      {getRankBadge(item.posicao)}
                    </TableCell>
                    <TableCell className="font-medium">{item.analista_nome}</TableCell>
                    {clientes.map((cliente) => (
                      <TableCell key={cliente} className="text-center">
                        {item.clientes[cliente] || 0}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary">
                      {item.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingAnalistas;