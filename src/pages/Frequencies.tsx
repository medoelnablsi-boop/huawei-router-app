import { Radio, Zap, Wifi, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/context/RouterContext';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Slider } from '@/components/ui/Slider';

type ApplyState = 'idle' | 'loading' | 'success' | 'error';

export function Frequencies() {
  const { bands, updateBand, applyFrequencies } = useRouter();
  const [applyState, setApplyState] = useState<ApplyState>('idle');
  const [applyError, setApplyError] = useState('');

  const handleApply = async () => {
    setApplyState('loading');
    setApplyError('');
    try {
      await applyFrequencies();
      setApplyState('success');
      setTimeout(() => setApplyState('idle'), 3000);
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      setApplyState('error');
      setTimeout(() => setApplyState('idle'), 4000);
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Toast */}
      {applyState === 'success' && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-bold">تم تطبيق إعدادات الترددات على الراوتر بنجاح</span>
          </div>
        </div>
      )}
      {applyState === 'error' && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-red-600 px-6 py-3 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            <span className="font-bold">{applyError || 'فشل تطبيق الإعدادات'}</span>
          </div>
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-blue-800">معلومات عن نطاقات التردد</p>
            <p className="mt-1 text-sm text-blue-600">
              نطاق 2.4GHz يوفر تغطية أوسع لكن بسرعة أقل، بينما نطاق 5GHz يوفر سرعة أعلى بمدى أقصر.
              اختر القناة والقوة المناسبة لتحسين أداء الشبكة. يتم إرسال التغييرات مباشرة إلى الراوتر.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {bands.map((band) => (
          <Card key={band.id}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${
                    band.band === '5GHz'
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                      : 'bg-gradient-to-br from-blue-500 to-blue-700'
                  }`}
                >
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">{band.band}</h3>
                  <p className="text-xs text-slate-400">
                    {band.enabled ? 'قناة نشطة' : 'معطّل'} • {band.channelWidth}MHz
                  </p>
                </div>
              </div>
              <Toggle
                checked={band.enabled}
                onChange={(checked) => updateBand(band.id, { enabled: checked })}
                label={`تفعيل ${band.band}`}
              />
            </div>

            <div className={`space-y-5 transition-opacity duration-200 ${!band.enabled ? 'pointer-events-none opacity-40' : ''}`}>
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
                <label className="mb-2 block text-sm font-medium text-slate-600">رقم القناة</label>
                <div className="flex flex-wrap gap-2">
                  {band.availableChannels.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => updateBand(band.id, { channel: ch })}
                      className={`min-w-[3rem] rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                        band.channel === ch
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">عرض القناة</label>
                <div className="flex gap-2">
                  {[20, 40, 80, 160].filter((w) => band.band === '5GHz' || w <= 40).map((width) => (
                    <button
                      key={width}
                      onClick={() => updateBand(band.id, { channelWidth: width })}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                        band.channelWidth === width
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {width}MHz
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                label="قوة إشارة البث"
                value={band.power}
                min={band.minPower}
                max={band.maxPower}
                unit="%"
                onChange={(value) => updateBand(band.id, { power: value })}
              />

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                <Zap className="h-4 w-4 text-amber-500" />
                <p className="text-xs text-slate-500">
                  {band.power >= 80
                    ? 'قوة عالية — قد تسبب تداخلاً مع الشبكات المجاورة'
                    : band.power >= 50
                    ? 'قوة متوسطة — مناسبة لمعظم البيئات'
                    : 'قوة منخفضة — مدى أقصر لكن استهلاك طاقة أقل'}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
          إلغاء
        </button>
        <button
          onClick={handleApply}
          disabled={applyState === 'loading'}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {applyState === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الإرسال إلى الراوتر...
            </>
          ) : (
            'حفظ وتطبيق الإعدادات'
          )}
        </button>
      </div>
    </div>
  );
}
