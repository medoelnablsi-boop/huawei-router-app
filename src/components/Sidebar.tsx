import { Gauge, Radio, Smartphone, Wifi, Users, LogOut, Server } from 'lucide-react';
import type { Page } from '@/types';
import { useRouter } from '@/context/RouterContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: Page; label: string; icon: typeof Gauge; description: string }[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: Gauge, description: 'نظرة عامة' },
  { id: 'frequencies', label: 'الترددات', icon: Radio, description: 'إعدادات النطاق' },
  { id: 'devices', label: 'الأجهزة المتصلة', icon: Smartphone, description: 'إدارة الأجهزة' },
  { id: 'network', label: 'إعدادات الشبكة', icon: Wifi, description: 'SSID وكلمة المرور' },
  { id: 'guest', label: 'شبكة الضيوف', icon: Users, description: 'وصول مؤقت' },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const { credentials, logout } = useRouter();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-72 flex-col border-l border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/20">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">هواوي</h1>
            <p className="text-xs font-medium text-slate-400">لوحة تحكم الراوتر</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`}
                />
                <div className="flex-1">
                  <p className={`text-sm font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                {active && <div className="h-6 w-1 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-6 py-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3">
            <div className="h-2.5 w-2.5 animate-pulse-soft rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="text-xs font-bold text-green-700">الراوتر متصل</p>
              <p className="text-xs text-green-500" dir="ltr">{credentials?.routerIP}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
