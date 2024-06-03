import { Shader } from "./Shader";
import { Texture } from "./Texture";
import { FrameBuffer } from "./FrameBuffer";
import { mat4, vec2 } from "gl-matrix";
import { Transform } from "../math/Transform";
import { VertexArray } from "./VertexArray";
import { UBO } from "./UBO";

export class Surface {
  private screenSize: vec2;
  private frameBuffer: FrameBuffer;
  private texture: Texture;
  private shader: Shader;
  private vertex: VertexArray;
  private transform: Transform;

  public ortho: mat4 = mat4.create();
  public clearColor: [number, number, number, number] = [1, 1, 1, 1];

  private ctx: WebGL2RenderingContext;

  constructor(
    ctx: WebGL2RenderingContext,
    size: vec2,
    shader: Shader,
    hasDepth = false
  ) {
    this.ctx = ctx;
    this.vertex = new VertexArray(ctx, {
      drawType: WebGL2RenderingContext.STATIC_DRAW,
      buffers: [
        {
          stride: 2,
          name: "a_position",
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
          data: new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
        },
        {
          stride: 2,
          name: "a_uv",
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
          data: new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
        },
      ],
    });
    this.transform = new Transform();
    this.screenSize = size;
    mat4.ortho(this.ortho, 0, size[0], 0, size[1], 0.1, 100);
    this.transform.scale = [size[0], size[1], 1];
    this.transform.translation = [0, 0, -10];
    this.frameBuffer = new FrameBuffer(ctx, 0);
    this.frameBuffer.attachment({ type: "color", size });
    if (hasDepth) this.frameBuffer.attachment({ type: "depth", size });
    this.texture = this.frameBuffer.getColorTexture()[0]!;
    this.shader = shader;
  }

  public rotate(r: number) {
    this.transform.rotation = [0, 0, r];
  }

  public scale(s: vec2) {
    this.transform.scale = [
      s[0] * this.screenSize[0],
      s[1] * this.screenSize[1],
      1,
    ];
  }

  public offset(o: vec2) {
    this.transform.translation = [o[0], o[1], -1];
  }

  public get size(): vec2 {
    return [this.transform.scale[0], this.transform.scale[1]];
  }

  public set size(s: vec2) {
    mat4.ortho(this.ortho, -s[0], s[0], -s[1], s[1], 0.1, 100);
  }

  public get depthTexture(): Texture {
    return this.frameBuffer.getDepthTexture()!;
  }

  public get colorTexture(): Texture[] {
    return this.frameBuffer.getColorTexture()!;
  }

  public bindTexture() {
    this.texture.bind();
  }

  public enable() {
    this.frameBuffer.bind();
    this.ctx.clearColor(
      this.clearColor[0],
      this.clearColor[1],
      this.clearColor[2],
      1
    );
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    this.ctx.viewport(0, 0, this.screenSize[0], this.screenSize[1]);
  }

  public disable() {
    this.frameBuffer.unbind();
  }

  public draw(ubo: UBO) {
    // Set up post-processing uniforms
    this.shader.uniform("u_texture", {
      type: "texture",
      value: this.texture.id,
    });
    ubo.bind();
    ubo.set("projection", this.ortho);
    ubo.set("view", this.transform.matrix);
    ubo.unbind();

    // Bind Surface to draw to the default render buffer
    this.texture.bind();
    this.vertex.bind();
    this.shader.bind();

    // Draw the screen quad
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, this.vertex.vertexCount);

    // Unbind screen
    this.shader.unbind();
    this.vertex.unbind();
    this.texture.unbind();
  }
}
