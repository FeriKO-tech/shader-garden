'use client';

import type { UniformDef, UniformValue, UniformValues } from '@/shaders/types';

type UniformControlsProps = {
  defs: UniformDef[];
  values: UniformValues;
  onChange: (next: UniformValues) => void;
  className?: string;
};

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toByte = (c: number) => Math.max(0, Math.min(255, Math.round(c * 255)));
  return `#${[toByte(r), toByte(g), toByte(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const num = parseInt(value, 16);
  if (Number.isNaN(num) || value.length !== 6) return [1, 1, 1];
  return [((num >> 16) & 0xff) / 255, ((num >> 8) & 0xff) / 255, (num & 0xff) / 255];
}

export function UniformControls({ defs, values, onChange, className }: UniformControlsProps) {
  if (defs.length === 0) return null;

  function update(name: string, value: UniformValue) {
    onChange({ ...values, [name]: value });
  }

  return (
    <div
      className={`grid gap-3 rounded-2xl border border-white/10 bg-bg-panel p-4 sm:grid-cols-2 ${className ?? ''}`}
    >
      {defs.map((def) => {
        const label = def.label ?? def.name;

        if (def.type === 'float') {
          const value = typeof values[def.name] === 'number' ? (values[def.name] as number) : def.default;
          const min = def.min ?? 0;
          const max = def.max ?? 1;
          const step = def.step ?? 0.01;

          return (
            <label key={def.name} className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                <span>{label}</span>
                <span className="text-ink-dim">{value.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => update(def.name, Number(event.target.value))}
                className="hk-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
              />
            </label>
          );
        }

        if (def.type === 'color') {
          const raw = values[def.name];
          const value: [number, number, number] = Array.isArray(raw) && raw.length === 3 ? (raw as [number, number, number]) : def.default;

          return (
            <label key={def.name} className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                {label}
              </span>
              <input
                type="color"
                value={rgbToHex(value)}
                onChange={(event) => update(def.name, hexToRgb(event.target.value))}
                className="h-8 w-12 cursor-pointer rounded-md border border-white/10 bg-transparent"
              />
            </label>
          );
        }

        // vec2
        const raw = values[def.name];
        const value: [number, number] = Array.isArray(raw) && raw.length === 2 ? (raw as [number, number]) : def.default;
        const min = def.min ?? 0;
        const max = def.max ?? 1;
        const step = def.step ?? 0.01;

        return (
          <div key={def.name} className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
              {label}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['x', 'y'] as const).map((axis, idx) => (
                <label key={axis} className="flex items-center gap-2 font-mono text-[10px] text-ink-dim">
                  <span>{axis}</span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value[idx]}
                    onChange={(event) => {
                      const next: [number, number] = [...value];
                      next[idx] = Number(event.target.value);
                      update(def.name, next);
                    }}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
                  />
                  <span>{value[idx].toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
