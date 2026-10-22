import { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff, Shield, Save, CheckCircle2, Router } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';

export function NetworkSettings() {
  const { bands, updateBand } = useRouter();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [passwords, setPasswords] = useState<Record<string, string>>({
    'band-24': 'MyHome@2024',
    'band-5': 'MyHome@2024',
  });
  const [encryption, setEncryption] = useState('WPA2-PSK');
  const [hiddenNetwork, setHiddenNetwork] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const encryptionTypes = ['WPA2-PSK', 'WPA3-SAE', 'WPA/WPA2 Mixed'];

  return (
    <div className="animate-fade-in space-y-5">
      {showSaved && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-bold">تم حفظ إعدادات الشبكة بنجاح</span>
          </div>
        </div>
      )}

      <Card title="معلومات الراوتر" icon={<Router className="h-5 w-5" />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">موديل الراوتر</p>
            <p className="mt-1 text-sm font-bold text-slate-700">Huawei AX3 Pro</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">عنوان IP</p>
            <p className="mt-1 text-sm font-bold text-slate-700" dir="ltr">192.168.1.1</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">إصدار البرنامج</p>
            <p className="mt-1 text-sm font-bold text-slate-700" dir="ltr">5.1.2.3</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {bands.map((band) => (
          <Card key={band.id}>
            <div className="mb-5 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  band.band === '5GHz' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}
              >
                <Wifi className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{band.band}</h3>
                <p className="text-xs text-slate-400">إعدادات شبكة النطاق</p>
              </div>
            </div>

            <div className={`space-y-4 ${!band.enabled ? 'pointer-events-none opacity-40' : ''}`}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">اسم الشبكة (SSID)</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Wifi className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={band.ssid}
                    onChange={(e) => updateBand(band.id, { ssid: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">كلمة المرور</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type={showPasswords[band.id] ? 'text' : 'password'}
                    value={passwords[band.id] || ''}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, [band.id]: e.target.value }))}
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    onClick={() => togglePassword(band.id)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords[band.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">8 أحرف على الأقل، يُفضّل استخدام أحرف وأرقام ورموز</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="إعدادات الأمان" icon={<Shield className="h-5 w-5" />}>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">نوع التشفير</label>
            <div className="flex flex-wrap gap-2">
              {encryptionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setEncryption(type)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                    encryption === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <EyeOff className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">إخفاء اسم الشبكة</p>
                <p className="text-xs text-slate-400">عدم بث اسم الشبكة — يجب إدخاله يدوياً</p>
              </div>
            </div>
            <Toggle checked={hiddenNetwork} onChange={setHiddenNetwork} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">جدار الحماية</p>
                <p className="text-xs text-slate-400">حماية الشبكة من الهجمات الخارجية</p>
              </div>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          <Save className="h-4 w-4" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
