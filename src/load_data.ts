import { WebGL, loadImages } from "./gl/WebGL";

import gltfvert from "./shaders/gltf/vertex.glsl?raw";
import gltffrag from "./shaders/gltf/fragment.glsl?raw";

import skyvert from "./shaders/skybox/vertex.glsl?raw";
import skyfrag from "./shaders/skybox/fragment.glsl?raw";

import bvert from "./shaders/basic/vertex.glsl?raw";
import bfrag from "./shaders/basic/fragment.glsl?raw";

import { vec2 } from "gl-matrix";
import { createQuadGeometry } from "./math/geometry/quad";
import { PerspectiveCamera } from "./renderer/Camera";
import { Light } from "./renderer/Light";
import { Skybox } from "./renderer/Skybox";
import { createSkyboxGeometry } from "./math/geometry/skybox";
import { loadGLTF } from "./gltf/loadGLTF";

export async function load_data(webgl: WebGL, dimensions: vec2) {
  const camera = new PerspectiveCamera(70, dimensions[0] / dimensions[1]);
  camera.position = [0.5, 0.5, 2];
  const quadVao = createQuadGeometry(webgl);
  const skyboxVao = createSkyboxGeometry(webgl);

  const skyboxShader = webgl.createShader("skybox", skyvert, skyfrag);
  const basicShader = webgl.createShader("basic", bvert, bfrag);
  const pbrShader = webgl.createShader("pbr", gltfvert, gltffrag);

  const light = new Light();
  light.position = [0, 0, 2];

  const skyboxTextures = await loadImages([
    "textures/skybox/right.jpg",
    "textures/skybox/left.jpg",
    "textures/skybox/bottom.jpg",
    "textures/skybox/top.jpg",
    "textures/skybox/front.jpg",
    "textures/skybox/back.jpg",
  ]);
  const skybox = new Skybox(webgl, skyboxTextures, skyboxShader, skyboxVao);

  const gltf = await loadGLTF(
    webgl,
    "models/FlightHelmet",
    "FlightHelmet.gltf"
  );

  return {
    camera,
    lights: [light],
    geometries: {
      quad: quadVao,
    },
    materials: gltf.materials,
    meshes: gltf.meshes,
    nodes: gltf.nodes,
    scenes: gltf.scenes,
    shaders: {
      basic: basicShader,
      pbr: pbrShader,
    },
    skybox,
  };
}
