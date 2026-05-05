precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scale;
uniform float u_speed;
uniform vec3 u_tint;

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
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.05;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect + 0.5;
  uv *= u_scale;

  vec2 drift = vec2(u_time * u_speed * 0.10, u_time * u_speed * 0.05);
  uv += drift + (u_mouse - 0.5) * 1.6;

  float n = fbm(uv + fbm(uv + drift));
  float cloud = smoothstep(0.35, 0.95, n);

  vec3 sky = vec3(0.05, 0.08, 0.18);
  vec3 horizon = vec3(0.20, 0.13, 0.32);
  vec3 base = mix(sky, horizon, vUv.y);
  vec3 col = mix(base, u_tint, cloud);
  col += pow(cloud, 4.0) * 0.25;

  gl_FragColor = vec4(col, 1.0);
}
