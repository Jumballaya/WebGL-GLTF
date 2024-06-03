import { Shader } from "../gl/Shader";
import { WebGL } from "../gl/WebGL";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { vec2 } from "gl-matrix";
import { Skybox } from "./Skybox";
import { RenderNode } from "./RenderNode";

export type Scene = {
  nodes: RenderNode[];
  light: Light;
  camera: Camera;
  skybox?: Skybox;
};

export class Renderer {
  private webgl: WebGL;
  public screenSize: vec2;

  private renderShader: Shader;

  constructor(webgl: WebGL, screenSize: vec2, renderShader: Shader) {
    this.webgl = webgl;
    this.screenSize = screenSize;
    this.renderShader = renderShader;
  }

  public render(scene: Scene) {
    this.webgl.viewport(0, 0, this.screenSize);
    this.webgl.clear("depth", "color");

    if (scene.skybox) {
      scene.skybox.draw(scene.camera);
    }

    this.renderScene(scene);
  }

  private renderScene(scene: Scene) {
    this.renderShader.bind();
    scene.camera.updateShader(this.renderShader, true);
    scene.light.updateShader(this.renderShader);

    for (const node of scene.nodes) {
      node.updateShader(this.renderShader);
      node.draw(this.webgl, this.renderShader);
    }

    this.renderShader.unbind();
  }
}
