import { CameraFlyController } from "./CameraFlyController";
import { Inputs } from "./Inputs";
import { load_data } from "./load_data";
import { Canvas } from "./renderer/Canvas";
import { Renderer } from "./renderer/Renderer";
import "./style.css";
import { vec2 } from "gl-matrix";

async function main() {
  const dimensions: vec2 = [1024, 786];
  const canvas = new Canvas(dimensions);

  const renderData = await load_data(canvas.webgl, dimensions);
  const { camera, scenes, lights, skybox } = renderData;
  const light = lights[0];
  const inputs = new Inputs(canvas.element);
  const cameraController = new CameraFlyController(camera, inputs);

  const renderer = new Renderer(
    canvas.webgl,
    dimensions,
    renderData.shaders.pbr
  );

  let t = Date.now();
  const draw = () => {
    // CREATE DT
    const time = Date.now();
    const dt = (time - t) / 1000;
    t = time;

    renderer.render({
      camera,
      light,
      skybox,
      nodes: scenes[0].nodes,
    });

    // UPDATE CAMERA CONTROLELR
    cameraController.update(dt);

    // light.position = [-3, 2 + 5 * Math.cos(t / 480), -3];
    // light.position = [0, Math.cos(t) * 2, 1];
    // renderData.scenes[0].nodes[0].transform.rotation = [0, x++ / 40, 0];

    requestAnimationFrame(draw);
  };
  draw();
}
main();
