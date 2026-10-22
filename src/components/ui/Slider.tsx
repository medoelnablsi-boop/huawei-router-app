interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
}

export function Slider({ value, min, max, onChange, label, unit }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">{label}</span>
          <span className="text-sm font-bold text-slate-800">
            {value}
            {unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to left, #2563eb ${percentage}%, #e2e8f0 ${percentage}%)`,
          direction: 'ltr',
        }}
      />
    </div>
  );
}
