import { WebGL } from "../../gl/WebGL";

export function createSkyboxGeometry(webgl: WebGL) {
  return webgl.createVertexArray({
    drawType: WebGL2RenderingContext.STATIC_DRAW,
    buffers: [
      {
        name: "a_position",
        type: WebGL2RenderingContext.FLOAT,
        stride: 3,
        normalized: false,
        data: new Float32Array([
          -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,

          -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,

          1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1,

          -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1,

          -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1, 1, -1,

          -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1, 1,
        ]),
      },
    ],
  });
}
