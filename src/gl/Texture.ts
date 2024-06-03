import { vec2 } from "gl-matrix";
import { TextureConfig } from "./types/configs";

let slot = 0;
export function get_next_texture_id() {
  return slot++;
}

export class Texture {
  private texture: WebGLTexture;
  private ctx: WebGL2RenderingContext;

  private slot: number;
  private element?: HTMLImageElement;

  constructor(
    ctx: WebGL2RenderingContext,
    image: HTMLImageElement | vec2,
    cfg: TextureConfig = {}
  ) {
    this.slot = get_next_texture_id();
    this.ctx = ctx;
    const texture = ctx.createTexture();
    const buffer = ctx.createBuffer();
    if (!texture) throw new Error("could not create webgl2 texture");
    if (!buffer) throw new Error("could not create pixel buffer for texture");
    this.texture = texture;
    this.bind();

    if (cfg.flipY === true) {
      this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, 0);
    } else {
      this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, -1);
    }

    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MIN_FILTER,
      cfg.minFilter ?? ctx.NEAREST
    );
    this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MAG_FILTER,
      cfg.magFilter ?? ctx.NEAREST
    );
    this.ctx.texParameteri(
      ctx.TEXTURE_2D,
      ctx.TEXTURE_WRAP_S,
      cfg.wrapS ?? ctx.REPEAT
    );
    this.ctx.texParameteri(
      ctx.TEXTURE_2D,
      ctx.TEXTURE_WRAP_T,
      cfg.wrapT ?? ctx.REPEAT
    );

    if (image instanceof HTMLImageElement) {
      ctx.texImage2D(
        ctx.TEXTURE_2D,
        0,
        ctx.RGBA,
        ctx.RGBA,
        ctx.UNSIGNED_BYTE,
        image
      );
      ctx.generateMipmap(ctx.TEXTURE_2D);
    } else {
      const internalFormat = cfg.internalFormat || ctx.RGBA;
      ctx.texImage2D(
        ctx.TEXTURE_2D,
        0,
        internalFormat,
        image[0],
        image[1],
        0,
        ctx.DEPTH_COMPONENT,
        ctx.UNSIGNED_INT,
        null
      );
    }
    this.unbind();
    if (image instanceof HTMLImageElement) {
      this.element = image;
    }
  }

  public get id(): number {
    return this.slot;
  }

  public getTexture() {
    return this.texture;
  }

  public bind(renderSlot?: number) {
    const slot = renderSlot ?? this.slot;
    this.ctx.activeTexture(this.ctx.TEXTURE0 + slot);
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
  }

  public unbind() {
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
  }

  public getImage(): HTMLImageElement | null {
    return this.element ?? null;
  }
}
