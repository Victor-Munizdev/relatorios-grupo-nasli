import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Filter, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface AvariaData {
  cliente_nome: string;
  total_avarias: number;
  avarias_cobradas: number;
  taxa_cobranca: number;
}

const RelatórioAvarias = () => {
  const [data, setData] = useState<AvariaData[]>([]);
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
      // Buscar avarias do mês/ano selecionado
      const { data: avarias, error } = await supabase
        .from('avarias')
        .select(`
          id,
          cliente_id,
          status,
          data_ocorrencia,
          clientes:cliente_id (
            nome
          )
        `)
        .gte('data_ocorrencia', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data_ocorrencia', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`);

      if (error) throw error;

      // Processar dados para criar o relatório
      const clienteMap = new Map<string, AvariaData>();

      avarias?.forEach((avaria) => {
        const clienteNome = avaria.clientes?.nome || 'Cliente Desconhecido';
        
        if (!clienteMap.has(clienteNome)) {
          clienteMap.set(clienteNome, {
            cliente_nome: clienteNome,
            total_avarias: 0,
            avarias_cobradas: 0,
            taxa_cobranca: 0,
          });
        }

        const clienteData = clienteMap.get(clienteNome)!;
        clienteData.total_avarias++;
        
        // Assumindo que avarias com status "Fechada" são cobradas
        if (avaria.status === 'Fechada') {
          clienteData.avarias_cobradas++;
        }
      });

      // Calcular taxa de cobrança
      const processedData = Array.from(clienteMap.values()).map(item => ({
        ...item,
        taxa_cobranca: item.total_avarias > 0 ? (item.avarias_cobradas / item.total_avarias) * 100 : 0,
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
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Avarias por Cliente");
    XLSX.writeFile(wb, `avarias_${selectedYear}_${selectedMonth}.xlsx`);
    
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
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
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
            </div>

            <div className="flex items-center gap-2">
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
            </div>

            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Avarias - Total vs Cobradas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cliente_nome" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_avarias" fill="hsl(var(--primary))" name="Total de Avarias" />
              <Bar dataKey="avarias_cobradas" fill="hsl(var(--secondary))" name="Avarias Cobradas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Total de Avarias</TableHead>
                <TableHead className="text-center">Avarias Cobradas</TableHead>
                <TableHead className="text-center">Taxa de Cobrança (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.cliente_nome}</TableCell>
                  <TableCell className="text-center">{item.total_avarias}</TableCell>
                  <TableCell className="text-center">{item.avarias_cobradas}</TableCell>
                  <TableCell className="text-center">{item.taxa_cobranca.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatórioAvarias;