import { Shader } from "../gl/Shader";
import { TextureCubeMap } from "../gl/TextureCubeMap";
import { VertexArray } from "../gl/VertexArray";
import { WebGL } from "../gl/WebGL";
import { Camera } from "./Camera";

export class Skybox {
  private webgl: WebGL;
  private texture: TextureCubeMap;
  private shader: Shader;
  private vao: VertexArray;

  constructor(
    webgl: WebGL,
    textures: HTMLImageElement[],
    shader: Shader,
    vao: VertexArray
  ) {
    this.texture = webgl.createCubeMapFromImages(textures);
    this.webgl = webgl;
    this.shader = shader;
    this.vao = vao;
  }

  public draw(camera: Camera) {
    this.webgl.depthMask(false);
    this.shader.bind();
    this.vao.bind();
    this.texture.bind(0);
    this.shader.uniform("u_skybox", {
      type: "texture",
      value: 0,
    });
    camera.updateShader(this.shader);
    this.webgl.drawArrays(this.vao.vertexCount, "triangles");
    this.shader.unbind();
    this.vao.unbind();
    this.texture.unbind();
    this.webgl.depthMask(true);
  }
}
