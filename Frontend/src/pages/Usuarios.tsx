import { useState, useEffect, Fragment } from "react";
import { UserService } from "@/services/userService";
import { Layout } from "@/components/Layout";
import { UserModal } from "@/components/modals/UserModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Mail, Phone, ChevronRight, ChevronDown } from "lucide-react";

const Usuarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const fetchUsers = async () => {
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    return (
      (user.nome_completo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderUserSystems = (user: any) => {
    const links = Array.isArray(user?.sistemas)
      ? user.sistemas
      : Array.isArray(user?.usuarioSistemas)
        ? user.usuarioSistemas
        : [];
    if (!links.length) {
      return <p className="text-sm text-muted-foreground">Nenhum sistema vinculado.</p>;
    }
    return (
      <div className="space-y-2">
        {links.map((link: any, idx: number) => {
          // Tente extrair nome/perfil de diferentes formatos
          const nome = link?.sistema?.nome || link?.nome || link?.sistema_nome || `ID #${link?.sistema_id ?? '-'}`;
          const perfil = link?.perfil || link?.papel || '—';
          const url = link?.sistema?.url || link?.url;
          const key = link?.id ?? `${user?.id ?? 'u'}-${link?.sistema?.id ?? link?.sistema_id ?? idx}`;
          return (
            <div key={key} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{nome}</span>
                <span className="text-xs text-muted-foreground">Perfil: {perfil}</span>
              </div>
              {url && (
                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">Acessar</a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status: boolean | string | number | null | undefined) => {
    const isActive = typeof status === 'boolean' ? status : Boolean(status && `${status}`.toLowerCase() === 'ativo');
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      "Administrador": "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
      "Gerente": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      "Usuário": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };

    return (
      <Badge className={variants[role] || "bg-gray-100 text-gray-800"}>
        {role}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie os usuários do sistema
            </p>
          </div>
          <Button 
            onClick={() => { setModalMode('create'); setSelectedUser(null); setIsModalOpen(true); }}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {users.length}
              </div>
              <p className="text-sm text-muted-foreground">Total de Usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => !!u.status).length}
              </div>
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === false).length}
              </div>
              <p className="text-sm text-muted-foreground">Usuários Inativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === "Administrador").length}
              </div>
              <p className="text-sm text-muted-foreground">Administradores</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os usuários cadastrados
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <Fragment key={user.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleExpand(user.id)}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(user.id); }}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md border"
                        aria-label={expanded[user.id] ? 'Recolher' : 'Expandir'}
                      >
                        {expanded[user.id] ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                      </button>
                      {user.nome_completo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalMode('edit');
                            setSelectedUser({
                              id: user.id,
                              name: user.nome_completo,
                              email: user.email,
                              empresa: user.empresa,
                              telefone: user.telefone,
                              setor: user.setor,
                              cargo: user.cargo,
                              data_nascimento: user.data_nascimento,
                              status: user.status,
                              sistemas: Array.isArray(user.usuarioSistemas)
                                ? user.usuarioSistemas.map((us: any) => us.sistema?.id ?? us.sistema_id)
                                : Array.isArray(user.sistemas)
                                  ? user.sistemas.map((s: any) => s.sistema_id ?? s.id)
                                  : []
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expanded[user.id] && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30">
                        <div className="p-3">
                          <p className="text-sm font-medium mb-2">Sistemas vinculados</p>
                          {renderUserSystems(user)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UserModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setSelectedUser(null);
        }}
        mode={modalMode}
        initialData={selectedUser}
        onSaved={fetchUsers}
      />
    </Layout>
  );
};

export default Usuarios;