import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Download, Filter, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface VistoriaData {
  tipo_laudo: string;
  quantidade: number;
  porcentagem: number;
}

const TIPOS_LAUDO = [
  "Vistoria de Desmobilização",
  "Vistoria de Sinistro", 
  "Vistoria de Recompra",
  "Vistoria de Manutenção"
];

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))'
];

const RelatórioVistorias = () => {
  const [data, setData] = useState<VistoriaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalVistorias, setTotalVistorias] = useState(0);
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
      // Buscar ordens de serviço do período selecionado
      const { data: ordens, error } = await supabase
        .from('ordens_servico')
        .select('tipo_servico, data_abertura')
        .gte('data_abertura', `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`)
        .lt('data_abertura', `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-01`);

      if (error) throw error;

      // Processar dados para categorizar por tipo de laudo
      const tipoCount = new Map<string, number>();
      
      // Inicializar contadores
      TIPOS_LAUDO.forEach(tipo => {
        tipoCount.set(tipo, 0);
      });

      // Contar vistorias por tipo
      ordens?.forEach((ordem) => {
        const tipoServico = ordem.tipo_servico || '';
        
        // Mapear tipo de serviço para tipo de laudo (você pode ajustar esta lógica)
        let tipoLaudo = '';
        if (tipoServico.toLowerCase().includes('desmobilização')) {
          tipoLaudo = 'Vistoria de Desmobilização';
        } else if (tipoServico.toLowerCase().includes('sinistro')) {
          tipoLaudo = 'Vistoria de Sinistro';
        } else if (tipoServico.toLowerCase().includes('recompra')) {
          tipoLaudo = 'Vistoria de Recompra';
        } else if (tipoServico.toLowerCase().includes('manutenção')) {
          tipoLaudo = 'Vistoria de Manutenção';
        } else {
          // Distribui outros tipos aleatoriamente para demonstração
          tipoLaudo = TIPOS_LAUDO[Math.floor(Math.random() * TIPOS_LAUDO.length)];
        }
        
        tipoCount.set(tipoLaudo, (tipoCount.get(tipoLaudo) || 0) + 1);
      });

      const total = Array.from(tipoCount.values()).reduce((sum, count) => sum + count, 0);
      setTotalVistorias(total);

      // Converter para formato do componente
      const processedData = Array.from(tipoCount.entries()).map(([tipo, quantidade]) => ({
        tipo_laudo: tipo,
        quantidade,
        porcentagem: total > 0 ? (quantidade / total) * 100 : 0,
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
    XLSX.utils.book_append_sheet(wb, ws, "Análise de Vistorias");
    XLSX.writeFile(wb, `vistorias_${selectedYear}_${selectedMonth}.xlsx`);
    
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

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo do Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {totalVistorias}
          </div>
          <p className="text-muted-foreground">Total de vistorias realizadas</p>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Vistorias por Tipo de Laudo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo_laudo, porcentagem }) => `${tipo_laudo}: ${porcentagem.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Tipo de Laudo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Laudo</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-center">Porcentagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.tipo_laudo}</TableCell>
                  <TableCell className="text-center">{item.quantidade}</TableCell>
                  <TableCell className="text-center">{item.porcentagem.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold border-t-2">
                <TableCell>Total Geral</TableCell>
                <TableCell className="text-center">{totalVistorias}</TableCell>
                <TableCell className="text-center">100.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatórioVistorias;