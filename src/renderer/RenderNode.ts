import { Shader } from "../gl/Shader";
import { WebGL } from "../gl/WebGL";
import { Transform } from "../math/Transform";
import { Mesh } from "./Mesh";

export class RenderNode {
  public children: RenderNode[] = [];
  public transform = new Transform();

  public updateShader(shader: Shader) {
    shader.uniform("u_model_matrix", {
      type: "mat4",
      value: this.transform.matrix,
    });
  }

  public draw(webgl: WebGL, shader: Shader) {
    if (this.children) {
      for (const child of this.children) {
        child.draw(webgl, shader);
      }
    }
  }
}

export class MeshRenderNode extends RenderNode {
  public mesh: Mesh;

  constructor(mesh: Mesh) {
    super();
    this.mesh = mesh;
  }

  public draw(webgl: WebGL, shader: Shader) {
    this.mesh.draw(webgl, shader);
    super.draw(webgl, shader);
  }
}
