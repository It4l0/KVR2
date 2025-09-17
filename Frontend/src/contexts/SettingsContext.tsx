import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type BackupFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
type BackupInclude = 'usuarios' | 'sistemas' | 'vinculos';

type Settings = {
  appName: string;
  appIconDataUrl: string | null; // base64 data URL
  backupFrequency: BackupFrequency;
  backupIncludes: BackupInclude[];
};

type SettingsContextType = Settings & {
  saveSettings: (s: Partial<Settings>) => void;
  resetSettings: () => void;
};

const DEFAULTS: Settings = {
  appName: 'KVR',
  appIconDataUrl: null,
  backupFrequency: 'daily',
  backupIncludes: ['usuarios', 'sistemas', 'vinculos'],
};

const STORAGE_KEY = 'kvr_settings_v1';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch {}
  }, []);

  const saveSettings = (s: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...s };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULTS);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const value = useMemo<SettingsContextType>(() => ({
    ...settings,
    saveSettings,
    resetSettings,
  }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
