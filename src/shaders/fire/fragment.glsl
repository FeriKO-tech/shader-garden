precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;
uniform float u_height;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

vec3 firePalette(float t) {
  vec3 c1 = vec3(0.02, 0.02, 0.05);
  vec3 c2 = vec3(0.55, 0.05, 0.05);
  vec3 c3 = vec3(1.00, 0.40, 0.05);
  vec3 c4 = vec3(1.00, 0.90, 0.45);
  vec3 c5 = vec3(1.00, 1.00, 0.95);

  if (t < 0.25) return mix(c1, c2, t * 4.0);
  if (t < 0.50) return mix(c2, c3, (t - 0.25) * 4.0);
  if (t < 0.75) return mix(c3, c4, (t - 0.50) * 4.0);
  return mix(c4, c5, (t - 0.75) * 4.0);
}

void main() {
  vec2 uv = vUv;
  float fromBottom = 1.0 - uv.y;

  vec2 p = uv;
  p.y -= u_time * 0.55;
  p.x += sin(u_time * 0.3 + uv.y * 4.0) * 0.05 + (u_mouse.x - 0.5) * 0.4;

  float n = fbm(p * vec2(2.0, 4.5));

  float shape = smoothstep(0.0, 1.0, fromBottom * u_height);
  float intensity = clamp(n * shape * u_intensity, 0.0, 1.0);

  vec3 col = firePalette(intensity);
  gl_FragColor = vec4(col, 1.0);
}
