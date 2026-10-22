import { Menu, Search, Bell, RefreshCw } from 'lucide-react';
import type { Page } from '@/types';

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'لوحة التحكم', subtitle: 'نظرة عامة على حالة الراوتر' },
  frequencies: { title: 'إعدادات الترددات', subtitle: 'تحكم بنطاقي 2.4GHz و 5GHz' },
  devices: { title: 'الأجهزة المتصلة', subtitle: 'إدارة جميع الأجهزة على الشبكة' },
  network: { title: 'إعدادات الشبكة', subtitle: 'اسم الشبكة وكلمة المرور' },
  guest: { title: 'شبكة الضيوف', subtitle: 'إنشاء وصول مؤقت للزوار' },
};

interface TopbarProps {
  currentPage: Page;
  onMenuClick: () => void;
}

export function Topbar({ currentPage, onMenuClick }: TopbarProps) {
  const { title, subtitle } = pageTitles[currentPage];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="بحث..."
              className="w-32 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
