import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { EquipmentDTO, EquipmentService } from '@/services/equipmentService';
import { UserService } from '@/services/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

const EQUIPMENT_TYPES = [
  { value: 'computador', label: 'Computador' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'teclado', label: 'Teclado' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'impressora', label: 'Impressora' },
  { value: 'outro', label: 'Outro' },
];

const Equipamentos = () => {
  const [items, setItems] = useState<EquipmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form state
  const [tipo, setTipo] = useState<string>('computador');
  const [identificacao, setIdentificacao] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [senhaPadrao, setSenhaPadrao] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | 'none'>('none');

  // Users options
  const [users, setUsers] = useState<any[]>([]);

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<EquipmentDTO | null>(null);
  const [eTipo, setETipo] = useState<string>('computador');
  const [eIdentificacao, setEIdentificacao] = useState('');
  const [eMarca, setEMarca] = useState<string | null>('');
  const [eModelo, setEModelo] = useState<string | null>('');
  const [eObservacoes, setEObservacoes] = useState<string | null>('');
  const [eAtivo, setEAtivo] = useState<boolean>(true);
  const [eUsuarioId, setEUsuarioId] = useState<number | 'none'>('none');
  const [eSenhaPadrao, setESenhaPadrao] = useState(''); // vazio = não alterar

  // Password visibility state per equipment id
  const [pwdVisible, setPwdVisible] = useState<Record<number, boolean>>({});
  const togglePwd = (id: number) => setPwdVisible((s) => ({ ...s, [id]: !s[id] }));

  const fetchData = async () => {
    try {
      const data = await EquipmentService.list();
      setItems(data);
    } catch (e) {
      console.error('Erro ao carregar equipamentos', e);
    } finally {
      setLoading(false);
    }
  };

  const onOpenEdit = (it: EquipmentDTO) => {
    setEditing(it);
    setETipo(it.tipo || 'computador');
    setEIdentificacao(it.identificacao || '');
    setEMarca(it.marca ?? '');
    setEModelo(it.modelo ?? '');
    setEObservacoes(it.observacoes ?? '');
    setEAtivo(Boolean(it.ativo));
    setEUsuarioId(it.usuario?.id ? Number(it.usuario.id) : 'none');
    setESenhaPadrao('');
    setOpenEdit(true);
  };

  const onSaveEdit = async () => {
    if (!editing?.id) return;
    try {
      const payload: any = {
        tipo: eTipo,
        identificacao: eIdentificacao,
        marca: eMarca ?? null,
        modelo: eModelo ?? null,
        observacoes: eObservacoes ?? null,
        ativo: eAtivo,
        usuarioId: eUsuarioId === 'none' ? null : Number(eUsuarioId),
      };
      if (eSenhaPadrao.trim().length > 0) {
        payload.senha_padrao = eSenhaPadrao;
      }
      await EquipmentService.update(editing.id, payload);
      setOpenEdit(false);
      setEditing(null);
      await fetchData();
    } catch (e) {
      console.error('Erro ao salvar alterações', e);
    }
  };

  const onDelete = async () => {
    if (!editing?.id) return;
    try {
      const ok = window.confirm('Tem certeza que deseja excluir este equipamento? Essa ação não pode ser desfeita.');
      if (!ok) return;
      await EquipmentService.remove(editing.id);
      setOpenEdit(false);
      setEditing(null);
      await fetchData();
    } catch (e) {
      console.error('Erro ao excluir equipamento', e);
    }
  };

  useEffect(() => {
    fetchData();
    (async () => {
      try {
        const list = await UserService.getUsers();
        setUsers(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('Erro ao carregar usuários', e);
      }
    })();
  }, []);

  const onCreate = async () => {
    if (!identificacao.trim()) return;
    try {
      await EquipmentService.create({
        tipo,
        identificacao,
        marca,
        modelo,
        observacoes: null,
        senha_padrao: senhaPadrao || null,
        ativo: true,
        usuarioId: usuarioId === 'none' ? undefined : Number(usuarioId),
      });
      setIdentificacao('');
      setMarca('');
      setModelo('');
      setSenhaPadrao('');
      setUsuarioId('none');
      await fetchData();
    } catch (e) {
      console.error('Erro ao criar equipamento', e);
    }
  };

  const filtered = items.filter((it) => {
    const q = search.toLowerCase();
    return (
      it.tipo?.toLowerCase().includes(q) ||
      it.identificacao?.toLowerCase().includes(q) ||
      (it.marca || '').toLowerCase().includes(q) ||
      (it.modelo || '').toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipamentos</h1>
            <p className="text-muted-foreground">Cadastre e visualize computadores e periféricos</p>
          </div>
        </div>

        {/* Quick create */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Novo Equipamento</CardTitle>
            <CardDescription>Adicionar rapidamente um equipamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Identificação / Patrimônio / Serial" value={identificacao} onChange={(e) => setIdentificacao(e.target.value)} />
              <Input placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
              <Input placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
              <Input type="text" placeholder="Senha padrão técnica (opcional)" value={senhaPadrao} onChange={(e) => setSenhaPadrao(e.target.value)} />
              <div>
                <Select value={String(usuarioId)} onValueChange={(v) => setUsuarioId(v === 'none' ? 'none' : Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Responsável (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem responsável</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.nome_completo || u.name || `Usuário #${u.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-primary" onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Lista de Equipamentos</CardTitle>
            <CardDescription>Visualize os equipamentos cadastrados</CardDescription>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por tipo, identificação, marca, modelo" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Identificação</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Senha Técnica</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Carregando...</TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">Nenhum equipamento encontrado</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="capitalize">{it.tipo}</TableCell>
                      <TableCell className="font-medium">{it.identificacao}</TableCell>
                      <TableCell>{it.marca || '-'}</TableCell>
                      <TableCell>{it.modelo || '-'}</TableCell>
                      <TableCell>{it.usuario?.nome_completo || '-'}</TableCell>
                      <TableCell>{it.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {pwdVisible[it.id!] ? (it.senha_padrao || '-') : (it.senha_padrao ? '••••••••' : '-')} 
                          </span>
                          {it.senha_padrao ? (
                            <Button variant="ghost" size="icon" onClick={() => togglePwd(it.id!)} title={pwdVisible[it.id!] ? 'Ocultar' : 'Revelar'}>
                              {pwdVisible[it.id!] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => onOpenEdit(it)}>Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Equipamento</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
              <div>
                <label className="text-sm text-muted-foreground">Tipo</label>
                <Select value={eTipo} onValueChange={setETipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Identificação</label>
                <Input value={eIdentificacao} onChange={(e) => setEIdentificacao(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Marca</label>
                <Input value={eMarca ?? ''} onChange={(e) => setEMarca(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Modelo</label>
                <Input value={eModelo ?? ''} onChange={(e) => setEModelo(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Responsável</label>
                <Select value={String(eUsuarioId)} onValueChange={(v) => setEUsuarioId(v === 'none' ? 'none' : Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Responsável (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem responsável</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.nome_completo || u.name || `Usuário #${u.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <Select value={eAtivo ? 'ativo' : 'inativo'} onValueChange={(v) => setEAtivo(v === 'ativo')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Observações</label>
                <Input value={eObservacoes ?? ''} onChange={(e) => setEObservacoes(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Senha padrão técnica (opcional)</label>
                <Input type="password" placeholder="Deixe em branco para não alterar" value={eSenhaPadrao} onChange={(e) => setESenhaPadrao(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button variant="destructive" onClick={onDelete}>Excluir</Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancelar</Button>
                  <Button className="bg-gradient-primary" onClick={onSaveEdit}>Salvar</Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Equipamentos;
