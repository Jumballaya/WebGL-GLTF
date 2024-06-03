import { WebGL } from "../../gl/WebGL";

export function createCubeGeometry(webgl: WebGL) {
  return webgl.createVertexArray({
    drawType: WebGL2RenderingContext.STATIC_DRAW,
    buffers: [
      {
        name: "a_position",
        type: WebGL2RenderingContext.FLOAT,
        stride: 3,
        normalized: false,
        data: new Float32Array([
          // FRONT
          -1, -1, 1, 1, -1, 1, 1, 1, 1,

          -1, -1, 1, 1, 1, 1, -1, 1, 1,

          // BACK
          1, -1, -1, -1, -1, -1, -1, 1, -1,

          1, -1, -1, -1, 1, -1, 1, 1, -1,

          // RIGHT
          1, -1, 1, 1, -1, -1, 1, 1, 1,

          1, -1, -1, 1, 1, -1, 1, 1, 1,

          // LEFT
          -1, -1, 1, -1, 1, 1, -1, -1, -1,

          -1, -1, -1, -1, 1, 1, -1, 1, -1,

          // TOP
          -1, 1, 1, 1, 1, 1, 1, 1, -1,

          -1, 1, 1, 1, 1, -1, -1, 1, -1,

          // BOTTOM
          -1, -1, 1, 1, -1, -1, 1, -1, 1,

          -1, -1, 1, -1, -1, -1, 1, -1, -1,
        ]),
      },
      {
        name: "a_uv",
        type: WebGL2RenderingContext.FLOAT,
        stride: 2,
        normalized: false,
        data: new Float32Array([
          1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,

          1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,

          1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1,

          0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,

          1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1,

          1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
        ]),
      },
      {
        name: "a_normal",
        type: WebGL2RenderingContext.FLOAT,
        stride: 3,
        normalized: false,
        data: new Float32Array([
          // FRONT
          0, 0, 1, 0, 0, 1, 0, 0, 1,

          0, 0, 1, 0, 0, 1, 0, 0, 1,

          // BACK
          0, 0, -1, 0, 0, -1, 0, 0, -1,

          0, 0, -1, 0, 0, -1, 0, 0, -1,

          // RIGHT
          1, 0, 0, 1, 0, 0, 1, 0, 0,

          1, 0, 0, 1, 0, 0, 1, 0, 0,

          // LEFT
          -1, 0, 0, -1, 0, 0, -1, 0, 0,

          -1, 0, 0, -1, 0, 0, -1, 0, 0,

          // TOP
          0, 1, 0, 0, 1, 0, 0, 1, 0,

          0, 1, 0, 0, 1, 0, 0, 1, 0,

          // BOTTOM
          0, -1, 0, 0, -1, 0, 0, -1, 0,

          0, -1, 0, 0, -1, 0, 0, -1, 0,
        ]),
      },
    ],
  });
}
