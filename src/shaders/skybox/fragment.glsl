#version 300 es

precision mediump float;

out vec4 outColor;

in vec3 v_pos;
uniform samplerCube u_skybox;

void main() {
  outColor = texture(u_skybox, v_pos);
}