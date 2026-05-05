precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scanlines;
uniform float u_flicker;
uniform vec3 u_color;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float ring(vec2 p, float r, float w) {
  return smoothstep(w, 0.0, abs(length(p) - r));
}

void main() {
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect;

  float pattern = 0.0;
  for (int i = 0; i < 5; i++) {
    float r = 0.10 + float(i) * 0.14 + sin(u_time * 0.8 + float(i)) * 0.02;
    pattern += ring(uv, r, 0.012);
  }

  vec2 grid = abs(fract(uv * 12.0) - 0.5);
  float gridLine = max(grid.x, grid.y);
  pattern += smoothstep(0.46, 0.50, gridLine) * 0.18;

  float core = exp(-length(uv) * 4.0);
  pattern += core * 0.6;

  vec2 mouseUv = (u_mouse - 0.5) * aspect;
  float pulse = sin(u_time * 1.4) * 0.5 + 0.5;
  pattern += ring(uv - mouseUv, 0.04 + pulse * 0.04, 0.012) * 0.7;

  float ca = length(uv) * 0.045;
  vec3 col = vec3(0.0);
  col.r = pattern * (1.0 + ca);
  col.g = pattern;
  col.b = pattern * (1.0 - ca * 0.5);

  col *= u_color;

  float flicker = 1.0 + u_flicker * (hash(vec2(floor(u_time * 35.0), 0.0)) - 0.5);
  col *= flicker;

  col *= 0.85 + 0.15 * sin(vUv.y * u_scanlines + u_time * 4.0);
  col += (hash(vUv * u_resolution + u_time) - 0.5) * 0.05;

  gl_FragColor = vec4(col, 1.0);
}
