#version 300 es

precision mediump float;

out vec4 outColor;
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_pos;
in mat3 v_TBN;

struct Material {
  vec3 albedo_color;
  float textureScale;
  float metallic_factor;
  float roughness_factor;
  sampler2D albedo;
  sampler2D normal;
  sampler2D ao;
  sampler2D roughness;
  sampler2D metallic;
  bool opaque;
};

struct Light {
  vec3 position;
  vec3 color;
  float intensity;

  float constant;
  float linear;
  float quadratic;
};

uniform Light u_light;
uniform Material u_material;
uniform vec3 u_view_position;

void main() {
  // Material textures
  vec4 ao_tex = texture(u_material.ao, v_uv * u_material.textureScale);
  vec4 rough_tex = texture(u_material.roughness, v_uv * u_material.textureScale);
  vec4 met_tex = texture(u_material.metallic, v_uv * u_material.textureScale);

  vec4 albedo_tex = texture(u_material.albedo, v_uv * u_material.textureScale);
  vec3 albedo_t = albedo_tex.rgb + u_material.albedo_color;
  vec3 normal_t = texture(u_material.normal, v_uv * u_material.textureScale).rgb + v_normal;

  vec3 ao = vec3(ao_tex.r);
  vec3 roughness = vec3(rough_tex.g);
  vec3 metallic = vec3(met_tex.b);

  // Normals
  vec3 normal = normalize(normal_t * 2.0 - 1.0);

  // Ambient
  vec3 ambient = u_light.color * 0.4 * albedo_t;

  // Diffuse
  vec3 light_dir = v_TBN * normalize(u_light.position - v_pos);
  float diff = max(dot(normal, light_dir), 0.0);
  vec3 diffuse = u_light.color * diff * albedo_t;

  // Specular
  vec3 view_dir = v_TBN * normalize(u_view_position - v_pos);
  vec3 halfwayDir = normalize(light_dir + view_dir);
  float spec = pow(max(dot(normal, halfwayDir), 0.0), 280.0);
  vec3 specular = (spec * metallic);

  // Attenuation
  float distance = length(u_light.position - v_pos);
  float attenuation = 1.0 / (u_light.constant + u_light.linear * distance + u_light.quadratic * (distance * distance));
  ambient *= attenuation;
  diffuse *= attenuation;

  // Lighting calculation
  vec3 lighting = ambient + diffuse + specular;
  float alpha = u_material.opaque ? 1.0 : albedo_tex.a;
  lighting = ao * lighting;
  outColor = vec4(lighting, alpha);
}