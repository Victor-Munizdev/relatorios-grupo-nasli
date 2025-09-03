import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";
import RelatórioAvarias from "@/components/reports/RelatórioAvarias";
import RelatórioVistorias from "@/components/reports/RelatórioVistorias";
import RankingAnalistas from "@/components/reports/RankingAnalistas";
import ProdutividadeAnalistas from "@/components/reports/ProdutividadeAnalistas";
import AnaliseOrdens from "@/components/reports/AnaliseOrdens";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">{/* ... keep existing code */}
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">
            Relatórios Grupo Nasli
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema de Análise e Controle de Vistorias
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Avarias</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vistorias Realizadas</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analistas Ativos</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 analistas seniores</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-muted">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Médio</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.2h</div>
              <p className="text-xs text-muted-foreground">-2.3h em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="avarias" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="avarias" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Avarias
            </TabsTrigger>
            <TabsTrigger value="vistorias" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Vistorias
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="produtividade" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              SLA
            </TabsTrigger>
            <TabsTrigger value="ordens" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              O.S.
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avarias">
            <RelatórioAvarias />
          </TabsContent>

          <TabsContent value="vistorias">
            <RelatórioVistorias />
          </TabsContent>

          <TabsContent value="ranking">
            <RankingAnalistas />
          </TabsContent>

          <TabsContent value="produtividade">
            <ProdutividadeAnalistas />
          </TabsContent>

          <TabsContent value="ordens">
            <AnaliseOrdens />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;