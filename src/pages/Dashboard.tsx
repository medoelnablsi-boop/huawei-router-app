import { useState, useEffect, useCallback } from 'react';
import { Activity, Cpu, HardDrive, Thermometer, Download, Upload, Smartphone, Radio, Clock, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { Card, StatCard } from '@/components/ui/Card';
import { SignalBars } from '@/components/ui/SignalBars';
import type { Page } from '@/types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { status, bands, devices, refreshStatus, credentials } = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await refreshStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر جلب بيانات الراوتر');
    } finally {
      setLoading(false);
    }
  }, [refreshStatus]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const avgSignal = Math.round(
    devices.reduce((sum, d) => sum + d.signalStrength, 0) / (devices.length || 1)
  );

  const cpuColor = status.cpuUsage > 70 ? 'red' : status.cpuUsage > 40 ? 'amber' : 'green';
  const memColor = status.memoryUsage > 70 ? 'red' : status.memoryUsage > 40 ? 'amber' : 'blue';
  const tempColor = status.temperature > 60 ? 'red' : status.temperature > 45 ? 'amber' : 'green';

  return (
    <div className="animate-fade-in space-y-5">
      {/* Connection banner */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
            <Radio className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">متصل بالراوتر</p>
            <p className="text-xs text-slate-400" dir="ltr">{credentials?.routerIP}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          تحديث
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">تعذّر جلب البيانات الحقيقية من الراوتر</p>
            <p className="text-xs text-amber-600">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="سرعة التنزيل الإجمالية"
          value={status.totalDownload}
          unit=" ميجابت/ث"
          icon={<Download className="h-5 w-5" />}
          color="blue"
          trend="مجموع سرعات التنزيل"
        />
        <StatCard
          label="سرعة الرفع الإجمالية"
          value={status.totalUpload}
          unit=" ميجابت/ث"
          icon={<Upload className="h-5 w-5" />}
          color="green"
          trend="مجموع سرعات الرفع"
        />
        <StatCard
          label="الأجهزة المتصلة"
          value={status.connectedDevices}
          icon={<Smartphone className="h-5 w-5" />}
          color="slate"
          trend={`${devices.filter((d) => d.band === '5GHz').length} على نطاق 5GHz`}
        />
        <StatCard
          label="متوسط قوة الإشارة"
          value={avgSignal}
          unit="%"
          icon={<Activity className="h-5 w-5" />}
          color="amber"
          trend="عبر جميع الأجهزة"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="حالة النظام" icon={<Cpu className="h-5 w-5" />} className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SystemMetric label="استخدام المعالج" value={status.cpuUsage} icon={<Cpu className="h-4 w-4" />} color={cpuColor} />
            <SystemMetric label="استخدام الذاكرة" value={status.memoryUsage} icon={<HardDrive className="h-4 w-4" />} color={memColor} />
            <SystemMetric label="درجة الحرارة" value={status.temperature} unit="°م" icon={<Thermometer className="h-4 w-4" />} color={tempColor} />
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">وقت التشغيل</span>
              </div>
              <p className="text-lg font-bold text-slate-700">{status.uptime}</p>
            </div>
          </div>
        </Card>

        <Card title="نطاقات التردد" icon={<Radio className="h-5 w-5" />}>
          <div className="space-y-3">
            {bands.map((band) => (
              <div
                key={band.id}
                className="cursor-pointer rounded-xl border border-slate-100 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                onClick={() => onNavigate('frequencies')}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        band.band === '5GHz'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {band.band === '5GHz' ? '5G' : '2.4G'}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{band.band}</p>
                      <p className="text-xs text-slate-400">قناة {band.channel}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      band.enabled
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {band.enabled ? 'مفعّل' : 'معطّل'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>قوة الإشارة: {band.power}%</span>
                  <span>العرض: {band.channelWidth}MHz</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="الأجهزة الأكثر استهلاكاً" icon={<Smartphone className="h-5 w-5" />}>
        <div className="space-y-2">
          {devices
            .slice()
            .sort((a, b) => b.downloadSpeed - a.downloadSpeed)
            .slice(0, 5)
            .map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between rounded-xl border border-slate-50 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Smartphone className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{device.name}</p>
                    <p className="text-xs text-slate-400">{device.band} • {device.ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SignalBars strength={device.signalStrength} />
                  <div className="text-left">
                    <p className="text-sm font-bold text-blue-600">{device.downloadSpeed} ميجابت/ث</p>
                    <p className="text-xs text-slate-400">تنزيل</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

function SystemMetric({
  label,
  value,
  unit = '%',
  icon,
  color,
}: {
  label: string;
  value: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mb-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-700">{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`}
          style={{ width: `${unit === '°م' ? Math.min((value / 80) * 100, 100) : value}%` }}
        />
      </div>
    </div>
  );
}
