import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SystemService } from "@/services/systemService"; // Import SystemService

interface InitialSystemData {
  id: number;
  name: string;
  empresa: string;
  perfis: string[]; // armazenamos como array internamente
  description: string;
  url: string;
}

interface SystemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  initialData?: InitialSystemData | null;
  onSaved?: () => void;
}

export function SystemModal({ open, onOpenChange, mode = 'create', initialData, onSaved }: SystemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    empresa: "",
    perfis: "",
    description: "",
    url: ""
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    empresa: "",
    perfis: "",
    description: "",
    url: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      const prefilled = {
        name: initialData.name || '',
        empresa: initialData.empresa || '',
        perfis: Array.isArray(initialData.perfis) ? initialData.perfis.join(',') : '',
        description: initialData.description || '',
        url: initialData.url || ''
      };
      setFormData(prefilled);
      setOriginalData(prefilled);
    }
    if (open && mode === 'create') {
      const emptyState = { name: '', empresa: '', perfis: '', description: '', url: '' };
      setFormData(emptyState);
      setOriginalData(emptyState);
    }
  }, [open, mode, initialData]);

  const isDirty = (key: keyof typeof formData) => formData[key] !== originalData[key];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'edit' && initialData) {
        await SystemService.updateSystem(initialData.id, formData);
      } else {
        await SystemService.createSystem(formData);
      }
      
      toast({
        title: "Sucesso",
        description: mode === 'edit' ? 'Sistema atualizado com sucesso' : 'Sistema cadastrado com sucesso',
        variant: "default"
      });
      
      // Reset form
      setFormData({ 
        name: "",
        empresa: "",
        perfis: "",
        description: "",
        url: ""
      });
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao cadastrar sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar Sistema' : 'Cadastrar Novo Sistema'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Sistema</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={isDirty('name') ? 'ring-2 ring-blue-500' : ''}
                required
              />
              {mode === 'edit' && isDirty('name') && (
                <p className="text-xs text-blue-600">Alterado (antes: {originalData.name || 'vazio'})</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className={isDirty('empresa') ? 'ring-2 ring-blue-500' : ''}
                required
              />
              {mode === 'edit' && isDirty('empresa') && (
                <p className="text-xs text-blue-600">Alterado (antes: {originalData.empresa || 'vazio'})</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="perfis">Perfis Disponíveis</Label>
            <Input
              id="perfis"
              value={formData.perfis}
              onChange={(e) => setFormData({ ...formData, perfis: e.target.value })}
              className={isDirty('perfis') ? 'ring-2 ring-blue-500' : ''}
              placeholder="Ex: admin,usuario,leitor"
              required
            />
            {mode === 'edit' && isDirty('perfis') && (
              <p className="text-xs text-blue-600">Alterado (antes: {originalData.perfis || 'vazio'})</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={isDirty('description') ? 'ring-2 ring-blue-500' : ''}
              rows={3}
            />
            {mode === 'edit' && isDirty('description') && (
              <p className="text-xs text-blue-600">Alterado (antes: {originalData.description || 'vazio'})</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className={isDirty('url') ? 'ring-2 ring-blue-500' : ''}
              required
            />
            {mode === 'edit' && isDirty('url') && (
              <p className="text-xs text-blue-600">Alterado (antes: {originalData.url || 'vazio'})</p>
            )}
          </div>
          
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
              {loading ? (mode === 'edit' ? 'Salvando...' : 'Criando...') : (mode === 'edit' ? 'Salvar Alterações' : 'Criar Sistema')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}