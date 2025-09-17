import { api } from './api';

export type BackupFormat = 'pdf' | 'excel' | 'sql';
export type BackupInclude = 'usuarios' | 'sistemas' | 'vinculos';

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const BackupService = {
  async export(format: BackupFormat, includes: BackupInclude[]) {
    const params = new URLSearchParams();
    params.set('format', format);
    if (includes.length) params.set('include', includes.join(','));

    const response = await api.get(`/backup/export?${params.toString()}` as const, {
      responseType: 'blob',
    });

    // Try to infer filename from headers; fallback
    const disp = response.headers['content-disposition'] as string | undefined;
    const fallback = `backup-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.${format === 'excel' ? 'xlsx' : format}`;
    let filename = fallback;
    if (disp) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disp);
      const name = decodeURIComponent(match?.[1] || match?.[2] || '');
      if (name) filename = name;
    }

    downloadBlob(response.data, filename);
  },
};
