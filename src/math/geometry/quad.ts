import { WebGL } from "../../gl/WebGL";

export function createQuadGeometry(webgl: WebGL) {
  return webgl.createVertexArray({
    drawType: WebGL2RenderingContext.STATIC_DRAW,
    buffers: [
      {
        name: "a_position",
        type: WebGL2RenderingContext.FLOAT,
        stride: 3,
        normalized: false,
        data: new Float32Array([
          -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
        ]),
      },
      {
        name: "a_uv",
        type: WebGL2RenderingContext.FLOAT,
        stride: 2,
        normalized: false,
        data: new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
      },
      {
        name: "a_normal",
        type: WebGL2RenderingContext.FLOAT,
        stride: 3,
        normalized: false,
        data: new Float32Array([
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        ]),
      },
    ],
  });
}
