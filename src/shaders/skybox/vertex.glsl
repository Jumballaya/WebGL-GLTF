#version 300 es

layout(location=0) in vec4 a_position;

uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

out vec3 v_pos;

void main() {
  gl_Position = u_projection_matrix * mat4(mat3(u_view_matrix)) * a_position;
  v_pos = normalize(a_position.xyz);
  v_pos.y = -v_pos.y;
}