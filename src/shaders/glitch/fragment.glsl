precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_mouse;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float t = floor(u_time * 10.0) / 10.0;
  float chaos = 0.04 + u_mouse.y * 0.18;

  float band = floor(uv.y * 80.0);
  float burst = step(0.92, rand(vec2(t, 1.0)));
  float offset = (rand(vec2(band, t)) - 0.5) * chaos * (0.4 + burst);

  float r = sin((uv.x + offset + u_time * 0.3) * 9.0) * 0.5 + 0.5;
  float g = sin((uv.y + u_time * 0.2) * 12.0) * 0.5 + 0.5;
  float b = sin((uv.x - offset + u_time * 0.45) * 6.0) * 0.5 + 0.5;

  vec3 color = vec3(r, g, b) * 0.85;
  color += pow(rand(uv + t), 18.0) * 0.5;

  float scan = sin(uv.y * 600.0) * 0.04;
  color -= scan;

  gl_FragColor = vec4(color, 1.0);
}
