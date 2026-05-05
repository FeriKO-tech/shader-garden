precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_smooth;

const int MAX_STEPS = 64;
const float MAX_DIST = 30.0;
const float SURF_DIST = 0.001;

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / max(k, 1e-4), 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float scene(vec3 p) {
  float t = u_time * 0.55;

  vec3 sp = p - vec3(sin(t) * 0.6, cos(t * 0.7) * 0.4, 0.0);
  float sphere = sdSphere(sp, 0.55);

  vec3 bp = p - vec3(-sin(t * 0.5) * 0.55, sin(t * 1.1) * 0.3, 0.0);
  bp.xy = rot(t * 0.6) * bp.xy;
  float box = sdBox(bp, vec3(0.38));

  vec3 tp = p - vec3(0.0, 0.0, sin(t * 0.4) * 0.5);
  tp.xy = rot(t) * tp.xy;
  float torus = sdTorus(tp, vec2(0.85, 0.16));

  float d = opSmoothUnion(sphere, box, u_smooth);
  d = opSmoothUnion(d, torus, u_smooth * 0.6);
  return d;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    scene(p + e.xyy) - scene(p - e.xyy),
    scene(p + e.yxy) - scene(p - e.yxy),
    scene(p + e.yyx) - scene(p - e.yyx)
  ));
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

  vec3 ro = vec3(0.0, 0.0, -3.0);
  float ang = (u_mouse.x - 0.5) * 2.2;
  ro.xz = rot(ang) * ro.xz;
  ro.y += (u_mouse.y - 0.5) * 1.5;

  vec3 forward = normalize(-ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 rd = normalize(forward + uv.x * right + uv.y * up);

  float d = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * d;
    float ds = scene(p);
    d += ds;
    if (ds < SURF_DIST || d > MAX_DIST) break;
  }

  vec3 col = vec3(0.04, 0.05, 0.10);
  if (d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = calcNormal(p);
    vec3 light = normalize(vec3(0.6, 0.8, -0.5));
    float diff = max(dot(n, light), 0.0);
    float spec = pow(max(dot(reflect(-light, n), -rd), 0.0), 32.0);
    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

    vec3 base = mix(vec3(0.42, 0.20, 0.72), vec3(0.96, 0.78, 1.00), diff);
    col = base + fresnel * vec3(0.50, 0.62, 1.00) * 0.55 + spec * vec3(1.0);
  }

  gl_FragColor = vec4(col, 1.0);
}
