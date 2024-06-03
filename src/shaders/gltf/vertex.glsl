#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_uv;
layout(location=2) in vec3 a_normal;
layout(location=3) in vec3 a_tangent;

out vec2 v_uv;
out vec3 v_normal;
out vec3 v_pos;
out mat3 v_TBN;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

void main() {
  v_uv = a_uv;
  v_normal = mat3(transpose(inverse(u_model_matrix))) * a_normal;
  v_pos = vec3(u_model_matrix * a_position);

  vec3 T = normalize(vec3(u_model_matrix * vec4(a_tangent, 0.0)));
  vec3 N = normalize(vec3(u_model_matrix * vec4(a_normal, 0.0)));
  T = normalize(T - dot(T, N) * N);
  vec3 B = cross(N, T);
  v_TBN = transpose(mat3(T, B, N));
  if (a_tangent == vec3(0.0, 0.0, 0.0)) {
    v_TBN = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
  }

  gl_Position = u_projection_matrix * u_view_matrix * vec4(v_pos, 1.0);
}