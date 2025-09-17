import { useState, useEffect } from "react";
import { SystemService } from "@/services/systemService";
import { Layout } from "@/components/Layout";
import { SystemModal } from "@/components/modals/SystemModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ExternalLink, Monitor } from "lucide-react";

const Sistemas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSystem, setSelectedSystem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSystems = async () => {
    try {
      const data = await SystemService.getSystems();
      setSystems(data);
    } catch (error) {
      console.error("Erro ao carregar sistemas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSystems = systems.filter(system => {
    if (!system) return false;
    return (
      (system.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (system.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Ativo": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      "Inativo": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      "Manutenção": "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      "Desenvolvimento": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    };

    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, string> = {
      "CRM": "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
      "ERP": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      "RH": "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      "Vendas": "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
    };

    return (
      <Badge className={variants[category] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    );
  };

  const handleEdit = (system: any) => {
    setModalMode('edit');
    setSelectedSystem({
      id: system.id,
      name: system.nome,
      empresa: system.empresa,
      perfis: Array.isArray(system.perfis) ? system.perfis : [],
      description: system.descricao,
      url: system.url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Excluir sistema:', id);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistemas</h1>
            <p className="text-muted-foreground">
              Gerencie os sistemas e aplicações da empresa
            </p>
          </div>
          <Button 
            onClick={() => { setModalMode('create'); setSelectedSystem(null); setIsModalOpen(true); }}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Sistema
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {systems.length}
              </div>
              <p className="text-sm text-muted-foreground">Total de Sistemas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {systems.filter(s => s.status === "Ativo").length}
              </div>
              <p className="text-sm text-muted-foreground">Sistemas Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {systems.filter(s => s.status === "Manutenção").length}
              </div>
              <p className="text-sm text-muted-foreground">Em Manutenção</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {systems.reduce((total, system) => total + (system.users || 0), 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total de Usuários</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lista de Sistemas</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os sistemas cadastrados
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sistemas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Acessar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSystems.map((system) => (
                  <TableRow key={system.id}>
                    <TableCell className="font-medium">{system.nome || 'N/A'}</TableCell>
                    <TableCell>{system.descricao || 'N/A'}</TableCell>
                    <TableCell>
                      <a href={system.url} target="_blank" rel="noreferrer">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Acessar <ExternalLink className="ml-1 h-4 w-4" />
                        </Button>
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={system.status === 'Ativo' ? 'default' : 'destructive'}>
                        {system.status || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(system)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(system.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <SystemModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedSystem(null);
        }}
        mode={modalMode}
        initialData={selectedSystem}
        onSaved={fetchSystems}
      />
    </Layout>
  );
};

export default Sistemas;