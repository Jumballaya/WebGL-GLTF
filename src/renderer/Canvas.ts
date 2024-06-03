import { WebGL } from "../gl/WebGL";
import { vec2 } from "gl-matrix";

export class Canvas {
  public element: HTMLCanvasElement;
  public webgl: WebGL;
  public screenSize: vec2;

  constructor(screenSize: vec2) {
    this.screenSize = screenSize;
    const canvas = document.createElement("canvas");
    canvas.width = screenSize[0];
    canvas.height = screenSize[1];
    document.body.appendChild(canvas);
    this.element = canvas;

    const ctx = canvas.getContext("webgl2", { alpha: false });
    if (!ctx) throw new Error("could not create webgl2 context");

    ctx.getExtension("EXT_color_buffer_float");
    const webgl = new WebGL(ctx);
    webgl.enable("depth", "blend", "cull_face");
    this.webgl = webgl;

    this.element.addEventListener("resize", () => {
      const rect = this.element.getBoundingClientRect();
      this.screenSize = [rect.width, rect.height];
    });

    this.element.addEventListener("fullscreenchange", () => {
      const rect = this.element.getBoundingClientRect();
      this.screenSize = [rect.width, rect.height];
    });
  }
}
