import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Monitor, Laptop, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { SystemService } from "@/services/systemService";
import { UserService } from "@/services/userService";
import { EquipmentService } from "@/services/equipmentService";

const Dashboard = () => {
  const [systemsCount, setSystemsCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [equipmentsCount, setEquipmentsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersPerSystem, setUsersPerSystem] = useState<{ id: number; nome: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [systemsResponse, usersResponse, equipmentsResponse] = await Promise.all([
          SystemService.getSystems(),
          UserService.getUsers(),
          EquipmentService.list()
        ]);
        
        setSystemsCount(systemsResponse.length);
        setUsersCount(usersResponse.length);
        setEquipmentsCount(equipmentsResponse.length);

        // Compute users per system
        const counts = systemsResponse.map((sys: any) => {
          const count = usersResponse.reduce((acc: number, u: any) => {
            const vincs = u.usuarioSistemas || u.vinculos || [];
            return acc + (Array.isArray(vincs) && vincs.some((v: any) => (v.sistema?.id ?? v.sistemaId) === sys.id) ? 1 : 0);
          }, 0);
          return { id: sys.id, nome: sys.nome ?? sys.name ?? `Sistema ${sys.id}` , count };
        });
        setUsersPerSystem(counts.sort((a,b) => b.count - a.count));
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total de Sistemas",
      value: systemsCount,
      description: "Sistemas cadastrados",
      icon: Monitor,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Total de Usuários",
      value: usersCount,
      description: "Usuários cadastrados",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total de Equipamentos",
      value: equipmentsCount,
      description: "Equipamentos cadastrados",
      icon: Laptop,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];



  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumo das principais informações do sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Carregando...
                    </div>
                  ) : error ? (
                    <span className="text-red-500">Erro</span>
                  ) : (
                    stat.value ?? 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users per System Chart */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Usuários por Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center text-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
              </div>
            ) : error ? (
              <span className="text-red-500">Erro ao carregar</span>
            ) : usersPerSystem.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados para exibir.</p>
            ) : (
              <div className="space-y-3">
                {usersPerSystem.map((item) => {
                  const max = Math.max(...usersPerSystem.map((i) => i.count), 1);
                  const pct = Math.round((item.count / max) * 100);
                  return (
                    <div key={item.id} className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-5 truncate text-sm" title={item.nome}>{item.nome}</div>
                      <div className="col-span-6">
                        <div className="h-3 w-full rounded bg-muted overflow-hidden">
                          <div className="h-3 bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="col-span-1 text-right text-sm tabular-nums">{item.count}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;