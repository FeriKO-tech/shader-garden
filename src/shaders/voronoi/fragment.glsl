precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec2 hash2(vec2 p) {
  return fract(
    sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453
  );
}

void main() {
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 uv = (vUv - 0.5) * aspect + 0.5;
  uv *= 5.0 + u_mouse.x * 4.0;

  vec2 i = floor(uv);
  vec2 f = fract(uv);

  float minDist = 1.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash2(i + neighbor);
      point = 0.5 + 0.5 * sin(u_time * 0.6 + 6.2831 * point);
      vec2 diff = neighbor + point - f;
      minDist = min(minDist, length(diff));
    }
  }

  vec3 cool = vec3(0.40, 0.20, 0.74);
  vec3 warm = vec3(0.96, 0.72, 0.98);
  vec3 color = mix(cool, warm, smoothstep(0.0, 1.0, minDist));
  color += pow(1.0 - minDist, 6.0) * 0.4;

  gl_FragColor = vec4(color, 1.0);
}
