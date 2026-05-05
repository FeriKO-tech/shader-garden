precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_density;
uniform float u_swirl;
uniform vec3 u_coreColor;
uniform vec3 u_haloColor;

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

void main() {
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect;
  uv += (u_mouse - 0.5) * 0.25;

  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  ang += u_swirl * (1.0 - clamp(r, 0.0, 1.0)) * 3.0 + u_time * 0.04;
  vec2 swirled = vec2(cos(ang), sin(ang)) * r;

  float layer1 = fbm(swirled * 4.0 + u_time * 0.06);
  float layer2 = fbm(swirled * 8.0 - u_time * 0.09);

  float falloff = 1.0 - smoothstep(0.0, 0.75, r);
  float density = pow(layer1, 2.0) * falloff + pow(layer2, 3.0) * 0.35;
  density *= u_density;

  float stars = pow(noise(uv * 80.0 + 0.5), 26.0) * 1.6;

  vec3 col = mix(vec3(0.02, 0.02, 0.06), u_haloColor, smoothstep(0.0, 0.6, density));
  col = mix(col, u_coreColor, smoothstep(0.3, 1.0, density));
  col += stars * vec3(1.0, 0.95, 0.85);

  float core = smoothstep(0.45, 0.0, r);
  col += core * u_coreColor * 0.65;

  gl_FragColor = vec4(col, 1.0);
}
