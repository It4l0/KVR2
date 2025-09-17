import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  Laptop,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Sistemas", url: "/sistemas", icon: Monitor },
  { title: "Equipamentos", url: "/equipamentos", icon: Laptop },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { appName, appIconDataUrl } = useSettings();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            {appIconDataUrl ? (
              <img src={appIconDataUrl} alt="App Icon" className="h-6 w-6 rounded" />
            ) : (
              <div className="h-6 w-6 rounded bg-primary/10 border border-border flex items-center justify-center text-xs font-semibold">
                {appName?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-foreground">{appName || 'KVR'}</h2>
              <p className="text-sm text-muted-foreground">Gerenciamento</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              isActive(item.url)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        {!collapsed && user && (
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground",
            collapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-sm">Sair</span>}
        </Button>
      </div>
    </div>
  );
}