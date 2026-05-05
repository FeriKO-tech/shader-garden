precision highp float;

varying vec2 vUv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.45;
  float warp = (u_mouse.x - 0.5) * 4.0;

  float v = sin(uv.x * 8.0 + t);
  v += sin(uv.y * 8.0 + t * 1.2);
  v += sin((uv.x + uv.y) * 6.0 + t * 0.8);
  v += sin(length(uv + vec2(warp * 0.2, 0.0)) * 10.0 - t);
  v *= 0.25;

  vec3 color = vec3(
    sin(v * 3.14159) * 0.5 + 0.5,
    sin(v * 3.14159 + 2.094) * 0.5 + 0.5,
    sin(v * 3.14159 + 4.188) * 0.5 + 0.5
  );

  gl_FragColor = vec4(color, 1.0);
}
