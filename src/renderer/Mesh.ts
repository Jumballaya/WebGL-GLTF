import { VertexArray } from "../gl/VertexArray";
import { IndexBuffer } from "../gl/IndexBuffer";
import { WebGL } from "../gl/WebGL";
import { Material } from "./Material";
import { Shader } from "../gl/Shader";

export class MeshPrimitive {
  public vao: VertexArray;
  public indices?: IndexBuffer;
  public material?: Material;

  constructor(vao: VertexArray, indices?: IndexBuffer, material?: Material) {
    this.vao = vao;
    this.indices = indices;
    this.material = material;
  }

  public bind() {
    this.vao.bind();
    if (this.indices) {
      this.indices.bind();
    }
  }

  public unbind() {
    this.vao.unbind();
    if (this.indices) {
      this.indices.unbind();
    }
  }
}

export class Mesh {
  private primitives: Array<MeshPrimitive>;

  constructor(primitives: Array<MeshPrimitive>) {
    this.primitives = primitives;
  }

  public draw(webgl: WebGL, shader: Shader) {
    for (const prim of this.primitives) {
      prim.bind();
      if (prim.material) {
        prim.material.updateShader(shader);
        if (prim.material.alphaMode === "blend") {
          webgl.enable("blend");
          webgl.blendFunc(
            WebGL2RenderingContext.SRC_ALPHA,
            WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA
          );
        }
      }
      if (prim.indices) {
        webgl.drawElements(prim.indices.count, "triangles");
      } else {
        webgl.drawArrays(prim.vao.vertexCount, "triangles");
      }
      prim.unbind();
    }
  }
}
