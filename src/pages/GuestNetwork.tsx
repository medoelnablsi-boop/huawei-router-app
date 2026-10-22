import { useState } from 'react';
import { Users, Wifi, Lock, Eye, EyeOff, Clock, Smartphone, Save, CheckCircle2, Copy } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Slider } from '@/components/ui/Slider';

export function GuestNetwork() {
  const { guest, updateGuest, toggleGuest } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const copyCredentials = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bandOptions: { value: typeof guest.band; label: string }[] = [
    { value: 'dual', label: 'ثنائي النطاق' },
    { value: '2.4GHz', label: '2.4GHz' },
    { value: '5GHz', label: '5GHz' },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      {showSaved && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-bold">تم حفظ إعدادات شبكة الضيوف</span>
          </div>
        </div>
      )}

      <Card className={guest.enabled ? 'border-green-200 bg-green-50/40' : 'border-slate-200'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-colors ${
                guest.enabled
                  ? 'bg-gradient-to-br from-green-500 to-green-700'
                  : 'bg-gradient-to-br from-slate-400 to-slate-500'
              }`}
            >
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">شبكة الضيوف</h3>
              <p className="text-sm text-slate-400">
                {guest.enabled ? 'مفعّلة — يمكن للضيوف الاتصال' : 'معطّلة — لا يمكن للضيوف الاتصال'}
              </p>
            </div>
          </div>
          <Toggle checked={guest.enabled} onChange={toggleGuest} />
        </div>
      </Card>

      <div className={`transition-opacity duration-200 ${!guest.enabled ? 'pointer-events-none opacity-40' : ''}`}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">اسم شبكة الضيوف (SSID)</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Wifi className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={guest.ssid}
                    onChange={(e) => updateGuest({ ssid: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">كلمة المرور</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={guest.password}
                    onChange={(e) => updateGuest({ password: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">النطاق</label>
                <div className="flex gap-2">
                  {bandOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateGuest({ band: opt.value })}
                      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                        guest.band === opt.value
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                label="مدة التشغيل"
                value={guest.duration}
                min={1}
                max={24}
                unit=" ساعة"
                onChange={(value) => updateGuest({ duration: value })}
              />

              <Slider
                label="الحد الأقصى للأجهزة"
                value={guest.maxDevices}
                min={1}
                max={30}
                unit=" جهاز"
                onChange={(value) => updateGuest({ maxDevices: value })}
              />
            </div>
          </Card>

          <div className="space-y-5">
            <Card title="معلومات الاتصال" icon={<Wifi className="h-5 w-5" />}>
              <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
                <div className="mb-4 flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-400">شبكة الضيوف</span>
                </div>
                <p className="mb-1 text-lg font-bold">{guest.ssid}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300" dir="ltr">
                    {showPassword ? guest.password : '••••••••'}
                  </p>
                  <button
                    onClick={copyCredentials}
                    className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>تنتهي خلال {guest.duration} ساعة</span>
                </div>
              </div>
            </Card>

            <Card title="إحصائيات" icon={<Smartphone className="h-5 w-5" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">الأجهزة المتصلة</span>
                  <span className="text-sm font-bold text-slate-700">
                    {guest.devicesConnected} / {guest.maxDevices}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(guest.devicesConnected / guest.maxDevices) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-slate-500">المدة المتبقية</span>
                  <span className="text-sm font-bold text-slate-700">{guest.duration} ساعة</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            <Save className="h-4 w-4" />
            حفظ إعدادات الضيوف
          </button>
        </div>
      </div>
    </div>
  );
}
