#version 300 es

precision mediump float;

out vec4 outColor;

in vec3 v_normal;

void main() {
  outColor = vec4(v_normal, 1.0);
}