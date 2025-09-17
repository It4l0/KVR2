import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Shield, Bell, Database, Mail, FileDown, FileSpreadsheet, FileText, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { BackupService } from "@/services/backupService";
import { UserService } from "@/services/userService";

const Configuracoes = () => {
  const { toast } = useToast();
  const { appName, appIconDataUrl, backupFrequency: ctxBackupFrequency, backupIncludes, saveSettings } = useSettings();
  const [name, setName] = useState(appName);
  const [iconPreview, setIconPreview] = useState<string | null>(appIconDataUrl);
  const [backupFrequency, setBackupFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>(ctxBackupFrequency ?? 'daily');
  const [includeUsers, setIncludeUsers] = useState(backupIncludes?.includes('usuarios') ?? true);
  const [includeSystems, setIncludeSystems] = useState(backupIncludes?.includes('sistemas') ?? true);
  const [includeLinks, setIncludeLinks] = useState(backupIncludes?.includes('vinculos') ?? true);

  useEffect(() => {
    setName(appName);
    setIconPreview(appIconDataUrl);
  }, [appName, appIconDataUrl]);

  useEffect(() => {
    if (ctxBackupFrequency) setBackupFrequency(ctxBackupFrequency);
    if (backupIncludes) {
      setIncludeUsers(backupIncludes.includes('usuarios'));
      setIncludeSystems(backupIncludes.includes('sistemas'));
      setIncludeLinks(backupIncludes.includes('vinculos'));
    }
  }, [ctxBackupFrequency, backupIncludes]);

  const handleIconChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setIconPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const includes: ("usuarios" | "sistemas" | "vinculos")[] = [];
    if (includeUsers) includes.push('usuarios');
    if (includeSystems) includes.push('sistemas');
    if (includeLinks) includes.push('vinculos');

    saveSettings({
      appName: name,
      appIconDataUrl: iconPreview || null,
      backupFrequency,
      backupIncludes: includes,
    });
    toast({
      title: "Configurações salvas!",
      description: "Preferências gerais e de backup atualizadas.",
    });
  };

  const doExport = async (format: 'pdf' | 'excel' | 'sql') => {
    const includes: ("usuarios" | "sistemas" | "vinculos")[] = [];
    if (includeUsers) includes.push('usuarios');
    if (includeSystems) includes.push('sistemas');
    if (includeLinks) includes.push('vinculos');
    try {
      await BackupService.export(format, includes);
      toast({ title: 'Exportação iniciada', description: `Gerando arquivo ${format.toUpperCase()}.` });
    } catch (e) {
      toast({ title: 'Erro ao exportar', description: 'Tente novamente mais tarde.', variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações gerais do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Configurações gerais da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nome da Aplicação</Label>
                <Input
                  id="app-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: KVR"
                />
              </div>

              <div className="space-y-2">
                <Label>Ícone da Aplicação</Label>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded border border-border flex items-center justify-center overflow-hidden bg-muted">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Icon preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem ícone</span>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIconChange(e.target.files?.[0] || undefined)}
                    />
                  </label>
                  {iconPreview && (
                    <Button type="button" variant="outline" onClick={() => setIconPreview(null)}>
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app-description">Descrição</Label>
                <Textarea 
                  id="app-description" 
                  defaultValue="Sistema completo de gerenciamento de usuários e aplicações"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="america-sao-paulo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-sao-paulo">América/São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    <SelectItem value="america-new-york">América/Nova York (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar modo de manutenção do sistema
                  </p>
                </div>
                <Switch />
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Política de Senhas</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Básica (6+ caracteres)</SelectItem>
                    <SelectItem value="medium">Média (8+ caracteres + números)</SelectItem>
                    <SelectItem value="high">Alta (12+ caracteres + símbolos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir 2FA para todos os usuários
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Log de Auditoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar todas as ações do sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />
              <div className="space-y-2">
                <Label>Redefinir senha de usuário</Label>
                <p className="text-xs text-muted-foreground">Selecione o usuário e redefina a senha para o padrão configurado.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input id="user-id-reset" type="number" placeholder="ID do usuário" className="sm:max-w-[220px]" />
                  <Button type="button" variant="destructive" onClick={async () => {
                    const input = document.getElementById('user-id-reset') as HTMLInputElement | null;
                    const id = Number(input?.value || 0);
                    if (!id) {
                      toast({ title: 'Informe o ID do usuário', variant: 'destructive' });
                      return;
                    }
                    try {
                      await UserService.resetPassword(id);
                      toast({ title: 'Senha redefinida', description: 'A senha foi redefinida para o padrão.' });
                    } catch (e) {
                      toast({ title: 'Erro ao redefinir', description: 'Verifique permissões e tente novamente.', variant: 'destructive' });
                    }
                  }} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" /> Redefinir
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">Padrão atual: variável de ambiente <code>DEFAULT_RESET_PASSWORD</code> (fallback: 123456).</p>
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Configurações de Notificação
              </CardTitle>
              <CardDescription>
                Configure as notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações importantes por email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre falhas e problemas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios Automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Envio automático de relatórios semanais
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email do Administrador</Label>
                <Input 
                  id="admin-email" 
                  type="email" 
                  defaultValue="admin@sistema.com" 
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Database/Backup Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Backup do Sistema
              </CardTitle>
              <CardDescription>
                Configure a frequência, dados incluídos e exporte seus backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                <Select value={backupFrequency} onValueChange={(v) => setBackupFrequency(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Incluir no backup</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeUsers} onChange={(e) => setIncludeUsers(e.target.checked)} />
                    Usuários
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeSystems} onChange={(e) => setIncludeSystems(e.target.checked)} />
                    Sistemas
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeLinks} onChange={(e) => setIncludeLinks(e.target.checked)} />
                    Vínculos Usuário-Sistema
                  </label>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button type="button" variant="outline" onClick={() => doExport('pdf')} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> PDF
                </Button>
                <Button type="button" variant="outline" onClick={() => doExport('excel')} className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </Button>
                <Button type="button" variant="outline" onClick={() => doExport('sql')} className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" /> SQL
                </Button>
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;