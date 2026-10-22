import { Wifi, WifiOff } from 'lucide-react';

interface SignalBarsProps {
  strength: number;
  showLabel?: boolean;
}

export function SignalBars({ strength, showLabel }: SignalBarsProps) {
  const bars = 4;
  const activeBars = Math.ceil((strength / 100) * bars);
  const color =
    strength >= 75 ? 'text-green-500' : strength >= 50 ? 'text-blue-500' : strength >= 25 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1.5 rounded-sm transition-all duration-300 ${
              i <= activeBars ? color : 'text-slate-200'
            }`}
            style={{
              height: `${i * 5 + 4}px`,
              backgroundColor: i <= activeBars ? 'currentColor' : '#e2e8f0',
            }}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold ${color}`}>{strength}%</span>
      )}
    </div>
  );
}

export function SignalIcon({ strength }: { strength: number }) {
  if (strength < 15) return <WifiOff className="h-5 w-5 text-red-500" />;
  return <Wifi className={`h-5 w-5 ${strength >= 50 ? 'text-green-500' : 'text-amber-500'}`} />;
}
