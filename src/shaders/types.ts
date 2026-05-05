export type FloatUniformDef = {
  name: string;
  type: 'float';
  default: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
};

export type Vec2UniformDef = {
  name: string;
  type: 'vec2';
  default: [number, number];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
};

export type ColorUniformDef = {
  name: string;
  type: 'color';
  default: [number, number, number];
  label?: string;
};

export type UniformDef = FloatUniformDef | Vec2UniformDef | ColorUniformDef;

export type UniformValue = number | [number, number] | [number, number, number];

export type UniformValues = Record<string, UniformValue>;

export function defaultUniformValues(defs: UniformDef[] | undefined): UniformValues {
  if (!defs) return {};
  const result: UniformValues = {};
  for (const def of defs) result[def.name] = def.default;
  return result;
}
