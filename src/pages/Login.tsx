import { useState, type FormEvent } from 'react';
import { Radio, Lock, User, Globe, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, Wifi } from 'lucide-react';
import { fetchToken } from '@/services/routerApi';

interface LoginProps {
  onLogin: (routerIP: string, username: string, password: string, token: string, cookie: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [routerIP, setRouterIP] = useState('192.168.8.1');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!routerIP.trim()) {
      setError('الرجاء إدخال عنوان IP الخاص بالراوتر');
      return;
    }
    if (!username.trim()) {
      setError('الرجاء إدخال اسم المستخدم');
      return;
    }
    if (!password.trim()) {
      setError('الرجاء إدخال كلمة المرور');
      return;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(routerIP.trim())) {
      setError('عنوان IP غير صالح — يجب أن يكون بالصيغة 192.168.8.1');
      return;
    }

    setLoading(true);
    try {
      const auth = await fetchToken(routerIP.trim());
      onLogin(routerIP.trim(), username.trim(), password, auth.token, auth.cookie);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900" dir="rtl">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-600/30">
              <Radio className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">هواوي</h1>
            <p className="mt-1 text-sm font-medium text-slate-400">لوحة تحكم الراوتر — تسجيل الدخول</p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Router IP */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <Globe className="h-4 w-4 text-blue-400" />
                  عنوان IP الخاص بالراوتر
                </label>
                <input
                  type="text"
                  value={routerIP}
                  onChange={(e) => setRouterIP(e.target.value)}
                  placeholder="192.168.8.1"
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <User className="h-4 w-4 text-blue-400" />
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  dir="ltr"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <Lock className="h-4 w-4 text-blue-400" />
                  كلمة مرور المسؤول
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-left text-sm font-medium text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm font-medium text-red-300">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الاتصال بالراوتر...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4" />
                    تسجيل الدخول وربط الراوتر
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs font-medium text-slate-400">
                يتم الاتصال بالراوتر محلياً. لا يتم إرسال بياناتك إلى أي خادم خارجي.
              </p>
            </div>
          </div>

          {/* Footer hint */}
          <p className="mt-6 text-center text-xs text-slate-500">
            القيم الافتراضية: IP هو 192.168.8.1 واسم المستخدم admin
          </p>
        </div>
      </div>
    </div>
  );
}
