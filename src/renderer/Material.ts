import { vec3 } from "gl-matrix";
import { Shader } from "../gl/Shader";
import { Texture } from "../gl/Texture";

export class Material {
  public albedo?: Texture;
  public normal?: Texture;
  public occlusion?: Texture;
  public metallicRoughness?: Texture;

  public albedoColor: vec3 = [0, 0, 0];
  public metallicFactor = 1;
  public roughnessFactor = 1;

  public textureScale = 1;

  public alphaMode: "blend" | "opaque" = "opaque";

  constructor() {}

  public updateShader(shader: Shader) {
    if (this.albedo) {
      this.albedo.bind(1);
      shader.uniform("u_material.albedo", {
        type: "texture",
        value: 1,
      });
    } else {
      shader.uniform("u_material.albedo", {
        type: "texture",
        value: 16,
      });
    }
    if (this.normal) {
      this.normal.bind(3);
      shader.uniform("u_material.normal", {
        type: "texture",
        value: 3,
      });
    } else {
      shader.uniform("u_material.normal", {
        type: "texture",
        value: 16,
      });
    }
    if (this.occlusion) {
      this.occlusion.bind(4);
      shader.uniform("u_material.ao", {
        type: "texture",
        value: 4,
      });
    } else {
      shader.uniform("u_material.ao", {
        type: "texture",
        value: 16,
      });
    }
    if (this.metallicRoughness) {
      this.metallicRoughness.bind(4);
      shader.uniform("u_material.metallic", {
        type: "texture",
        value: 4,
      });
      shader.uniform("u_material.roughness", {
        type: "texture",
        value: 4,
      });
    } else {
      shader.uniform("u_material.metallic", {
        type: "texture",
        value: 16,
      });
      shader.uniform("u_material.roughness", {
        type: "texture",
        value: 16,
      });
    }
    shader.uniform("u_material.textureScale", {
      type: "float",
      value: this.textureScale,
    });
    shader.uniform("u_material.albedo_color", {
      type: "vec3",
      value: this.albedoColor,
    });
    shader.uniform("u_material.roughness_factor", {
      type: "float",
      value: this.roughnessFactor,
    });
    shader.uniform("u_material.metallic_factor", {
      type: "float",
      value: this.metallicFactor,
    });
    shader.uniform("u_material.opaque", {
      type: "boolean",
      value: this.alphaMode === "opaque",
    });
  }
}
