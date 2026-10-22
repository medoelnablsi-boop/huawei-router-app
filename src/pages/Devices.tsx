import { useState } from 'react';
import {
  Smartphone, Laptop, Tv, Printer, Tablet, Speaker, Gamepad2,
  Ban, Trash2, Search, Download, Upload, Filter,
} from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { Card } from '@/components/ui/Card';
import { SignalBars } from '@/components/ui/SignalBars';
import { Toggle } from '@/components/ui/Toggle';
import type { ConnectedDevice } from '@/types';

const iconMap: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  laptop: Laptop,
  tv: Tv,
  printer: Printer,
  tablet: Tablet,
  speaker: Speaker,
  gamepad: Gamepad2,
};

const bandFilters = ['الكل', '2.4GHz', '5GHz'] as const;

export function Devices() {
  const { devices, toggleDeviceBlock, removeDevice } = useRouter();
  const [search, setSearch] = useState('');
  const [bandFilter, setBandFilter] = useState<(typeof bandFilters)[number]>('الكل');

  const filtered = devices.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.ip.includes(search) || d.mac.toLowerCase().includes(search.toLowerCase());
    const matchesBand = bandFilter === 'الكل' || d.band === bandFilter;
    return matchesSearch && matchesBand;
  });

  return (
    <div className="animate-fade-in space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الجهاز أو IP أو MAC..."
              className="flex-1 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            {bandFilters.map((f) => (
              <button
                key={f}
                onClick={() => setBandFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  bandFilter === f
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggleBlock={() => toggleDeviceBlock(device.id)}
            onRemove={() => removeDevice(device.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Smartphone className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">لا توجد أجهزة مطابقة لبحثك</p>
        </div>
      )}
    </div>
  );
}

function DeviceCard({
  device,
  onToggleBlock,
  onRemove,
}: {
  device: ConnectedDevice;
  onToggleBlock: () => void;
  onRemove: () => void;
}) {
  const Icon = iconMap[device.icon] || Smartphone;

  return (
    <Card className={`transition-all ${device.isBlocked ? 'opacity-60' : ''}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${device.isBlocked ? 'bg-slate-100' : 'bg-blue-50'}`}>
            <Icon className={`h-5 w-5 ${device.isBlocked ? 'text-slate-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{device.name}</p>
            <p className="text-xs text-slate-400">{device.ip}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            device.band === '5GHz'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          {device.band}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">عنوان MAC</span>
          <span className="font-mono font-medium text-slate-600" dir="ltr">{device.mac}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">مدة الاتصال</span>
          <span className="font-medium text-slate-600">{device.connectedSince}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">البيانات المستهلكة</span>
          <span className="font-medium text-slate-600">{device.dataUsed} جيجابايت</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-3">
          <div className="flex items-center gap-1.5 text-blue-600">
            <Download className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">تنزيل</span>
          </div>
          <p className="mt-1 text-lg font-extrabold text-blue-700">{device.downloadSpeed}</p>
          <p className="text-xs text-blue-400">ميجابت/ث</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3">
          <div className="flex items-center gap-1.5 text-green-600">
            <Upload className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">رفع</span>
          </div>
          <p className="mt-1 text-lg font-extrabold text-green-700">{device.uploadSpeed}</p>
          <p className="text-xs text-green-400">ميجابت/ث</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">قوة الإشارة</span>
        <SignalBars strength={device.signalStrength} showLabel />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">حظر الجهاز</span>
          <Toggle checked={device.isBlocked} onChange={onToggleBlock} />
        </div>
        <button
          onClick={onRemove}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {device.isBlocked && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-2">
          <Ban className="h-4 w-4 text-red-500" />
          <span className="text-xs font-bold text-red-500">هذا الجهاز محظور من الاتصال</span>
        </div>
      )}
    </Card>
  );
}
