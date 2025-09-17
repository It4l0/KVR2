import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import { SystemService } from "@/services/systemService"; // Import SystemService
import { UserService } from "@/services/userService"; // Import UserService
import { Badge } from "@/components/ui/badge";
import { Power, Laptop } from "lucide-react";
import { EquipmentService } from "@/services/equipmentService";

interface InitialUserData {
  id: number;
  name: string;
  email: string;
  empresa: string;
  telefone: string;
  setor: string;
  cargo: string;
  data_nascimento: string;
  sistemas?: number[];
  status?: boolean;
}

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialData?: InitialUserData | null;
  onSaved?: () => void;
}

export function UserModal({ open, onOpenChange, mode = 'create', initialData, onSaved }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    empresa: '',
    telefone: '',
    setor: '',
    cargo: '',
    data_nascimento: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [systems, setSystems] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [status, setStatus] = useState<boolean | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [equipLoading, setEquipLoading] = useState(false);

  useEffect(() => {
    const loadSystems = async () => {
      try {
        const data = await SystemService.getSystems();
        setSystems(data);
      } catch (error) {
        console.error('Erro ao carregar sistemas:', error);
      }
    };
    
    loadSystems();
  }, []);

  // Preencher formulário quando abrir em modo de edição
  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '', // senha é opcional no edit
        empresa: initialData.empresa || '',
        telefone: initialData.telefone || '',
        setor: initialData.setor || '',
        cargo: initialData.cargo || '',
        data_nascimento: initialData.data_nascimento ? initialData.data_nascimento.substring(0,10) : ''
      });
      setSelectedSystems(initialData.sistemas || []);
      setStatus(typeof initialData.status === 'boolean' ? initialData.status : null);

      // Carregar equipamentos vinculados ao usuário
      (async () => {
        try {
          setEquipLoading(true);
          const list = await EquipmentService.list();
          const userEquip = Array.isArray(list)
            ? list.filter((eq: any) => (eq.usuario?.id ?? eq.usuarioId) === initialData.id)
            : [];
          setEquipments(userEquip);
        } catch (err) {
          console.error('Erro ao carregar equipamentos do usuário:', err);
          setEquipments([]);
        } finally {
          setEquipLoading(false);
        }
      })();
    }
    if (open && mode === 'create') {
      // limpar ao abrir criação
      setFormData({ 
        name: '', email: '', password: '', empresa: '', telefone: '', setor: '', cargo: '', data_nascimento: ''
      });
      setSelectedSystems([]);
      setStatus(null);
      setEquipments([]);
    }
  }, [open, mode, initialData]);

  const handleSystemToggle = (systemId) => {
    setSelectedSystems(prev => 
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'edit' && initialData) {
        await UserService.updateUser(initialData.id, {
          name: formData.name,
          email: formData.email,
          // senha opcional: só envia se preenchida
          ...(formData.password ? { password: formData.password } : {}),
          empresa: formData.empresa,
          telefone: formData.telefone,
          setor: formData.setor,
          cargo: formData.cargo,
          data_nascimento: formData.data_nascimento,
          sistemas: selectedSystems
        });
      } else {
        await UserService.createUser({
          ...formData,
          sistemas: selectedSystems
        });
      }
      
      toast({
        title: "Sucesso",
        description: mode === 'edit' ? "Usuário atualizado com sucesso" : "Usuário cadastrado com sucesso",
        variant: "default"
      });
      
      setFormData({ 
        name: '',
        email: '',
        password: '',
        empresa: '',
        telefone: '',
        setor: '',
        cargo: '',
        data_nascimento: ''
      });
      setSelectedSystems([]);
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: (error as any).response?.data?.message || (mode === 'edit' ? "Erro ao atualizar usuário" : "Erro ao cadastrar usuário"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[640px] md:max-w-[760px] lg:max-w-[820px] max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Atualize os dados do usuário.' : 'Preencha os dados para criar um novo usuário no sistema.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '70vh' }}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha {mode === 'edit' ? '(deixe em branco para não alterar)' : ''}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={mode === 'edit' ? 'Informe nova senha (opcional)' : 'Digite a senha'}
              required={mode !== 'edit'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          {mode === 'edit' && initialData && (
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <Label>Status do Usuário</Label>
                <div>
                  {status === null ? (
                    <Badge variant="secondary">Desconhecido</Badge>
                  ) : status ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant={status ? 'destructive' : 'secondary'}
                onClick={async () => {
                  if (status === null) return;
                  const next = !status;
                  const ok = window.confirm(`${next ? 'Ativar' : 'Desativar'} o usuário "${initialData.name}"?`);
                  if (!ok) return;
                  try {
                    setStatusLoading(true);
                    await UserService.updateUser(initialData.id, { status: next });
                    setStatus(next);
                    toast({ title: 'Status atualizado', description: `Usuário ${next ? 'ativado' : 'desativado'} com sucesso.` });
                    onSaved?.();
                  } catch (err) {
                    console.error('Erro ao alterar status do usuário', err);
                    toast({ title: 'Erro ao alterar status', variant: 'destructive' });
                  } finally {
                    setStatusLoading(false);
                  }
                }}
                disabled={statusLoading}
                className="inline-flex items-center gap-2"
              >
                <Power className="h-4 w-4" /> {status ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Input
                id="setor"
                value={formData.setor}
                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                placeholder="Setor/Departamento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Cargo/Função"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Sistemas</Label>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {systems.map((system) => {
                const linked = selectedSystems.includes(system.id);
                return (
                  <div key={system.id} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <p className="font-medium leading-none">{system.nome}</p>
                      {system.empresa && (
                        <p className="text-xs text-muted-foreground">Empresa: {system.empresa}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant={linked ? 'outline' : 'default'}
                      className={linked ? 'border-destructive text-destructive' : ''}
                      onClick={() => handleSystemToggle(system.id)}
                    >
                      {linked ? 'Desvincular' : 'Vincular'}
                    </Button>
                  </div>
                );
              })}
              {systems.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum sistema cadastrado.</p>
              )}
            </div>
          </div>

          {mode === 'edit' && (
            <div className="space-y-2">
              <Label>Equipamentos vinculados</Label>
              <div className="space-y-2 max-h-56 overflow-auto pr-1">
                {equipLoading ? (
                  <p className="text-sm text-muted-foreground">Carregando equipamentos...</p>
                ) : equipments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum equipamento vinculado.</p>
                ) : (
                  equipments.map((eq) => (
                    <div key={eq.id} className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium leading-none">
                            {eq.tipo} • {eq.identificacao}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {eq.marca || '-'} {eq.modelo ? `• ${eq.modelo}` : ''}
                          </p>
                        </div>
                      </div>
                      <Badge variant={eq.ativo ? 'default' : 'secondary'}>
                        {eq.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (mode === 'edit' ? 'Salvando...' : 'Criando...') : (mode === 'edit' ? 'Salvar Alterações' : 'Criar Usuário')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}