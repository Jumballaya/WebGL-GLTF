import { IndexBuffer } from "../gl/IndexBuffer";
import { WebGL, loadImages } from "../gl/WebGL";
import { Mesh, MeshPrimitive } from "../renderer/Mesh";
import { MeshRenderNode, RenderNode } from "../renderer/RenderNode";
import { Texture } from "../gl/Texture";
import { Material } from "../renderer/Material";
import { VertexArrayConfig } from "../gl/types/configs";
import { AccessorComponentType, AccessorType, GLTFFile } from "./gltf.type";
import { vec4 } from "gl-matrix";

type Accessor = {
  buffer: ArrayBuffer;
  component: AccessorComponentType;
  type: AccessorType;
};

export async function loadGLTF(webgl: WebGL, path: string, filename: string) {
  const gltfFilepath = `${path}/${filename}`;
  const fileResponse = await fetch(gltfFilepath);
  const fileContents = await fileResponse.text();
  const gltfFile = JSON.parse(fileContents);
  return await parseGTLF(webgl, gltfFile, path);
}

async function parseGTLF(webgl: WebGL, gltfFile: GLTFFile, path: string) {
  const buffers = await parseBuffers(gltfFile, path);
  const bufferViews = parseBufferViews(gltfFile, buffers);
  const accessors = parseAccessors(gltfFile, bufferViews);

  const textures = await parseTextures(webgl, path, gltfFile);
  const materials = parseMaterials(gltfFile, textures);

  const meshes = setupMeshes(
    webgl,
    parseMeshes(gltfFile, accessors, materials)
  );
  const nodes = parseNodes(gltfFile, meshes);
  const scenes = parseScenes(gltfFile, nodes);

  return {
    buffers,
    bufferViews,
    accessors,
    materials,
    meshes,
    nodes,
    textures,
    scenes,
    scene: gltfFile.scene,
  };
}

async function parseTextures(webgl: WebGL, path: string, gltfFile: GLTFFile) {
  if (!gltfFile.images || !gltfFile.textures) return [];
  const imagePaths = gltfFile.images.map((img) => `${path}/${img.uri}`) ?? [];
  const images = await loadImages(imagePaths);
  const samplers = gltfFile.samplers;
  const textures = gltfFile.textures.map((tex) => {
    const sampler = samplers?.[tex.sampler];
    return webgl.createTexture(images[tex.source], {
      flipY: true,
      magFilter: sampler?.magFilter
        ? getSamplerValue(sampler.magFilter)
        : undefined,
      minFilter: sampler?.magFilter
        ? getSamplerValue(sampler.minFilter)
        : undefined,
      wrapS: sampler?.wrapS ? getSamplerValue(sampler.wrapS) : undefined,
      wrapT: sampler?.wrapT ? getSamplerValue(sampler.wrapT) : undefined,
    });
  });
  return textures;
}

function parseScenes(gltfFile: GLTFFile, nodes: RenderNode[]) {
  return gltfFile.scenes.map((scene) => ({
    nodes: scene.nodes.map((node) => nodes[node]),
  }));
}

function parseNodes(gltfFile: GLTFFile, meshes: Mesh[]) {
  const nodes: RenderNode[] = [];
  for (const gltfNode of gltfFile.nodes) {
    let node: RenderNode;
    if (gltfNode.mesh !== undefined) {
      const mesh = meshes[gltfNode.mesh];
      node = new MeshRenderNode(mesh);
    } else {
      node = new RenderNode();
    }
    if (gltfNode.rotation) {
      node.transform.rotation = gltfNode.rotation;
    }
    if (gltfNode.translation) {
      node.transform.translation = gltfNode.translation;
    }
    if (gltfNode.scale) {
      node.transform.scale = gltfNode.scale;
    }
    if (gltfNode.matrix) {
      node.transform.fromMatrix(gltfNode.matrix);
    }
    nodes.push(node);
  }
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const gltfNode = gltfFile.nodes[i];
    if (gltfNode.children) {
      for (const child of gltfNode.children) {
        node.children.push(nodes[child]);
      }
    }
  }
  return nodes;
}

function parseMaterials(gltfFile: GLTFFile, textures: Texture[]) {
  const materials: Material[] = [];
  for (const gltfMat of gltfFile.materials ?? []) {
    const albedo = gltfMat.pbrMetallicRoughness?.baseColorTexture?.index;
    const normal = gltfMat.normalTexture?.index;
    const occlusion = gltfMat.occlusionTexture?.index;
    const metallicRoughness =
      gltfMat.pbrMetallicRoughness?.metallicRoughnessTexture?.index;
    const albedoTexture = albedo === undefined ? undefined : textures[albedo];
    const normalTexture = normal === undefined ? undefined : textures[normal];
    const occlusionTexture =
      occlusion === undefined ? undefined : textures[occlusion];
    const metRoughTexture =
      metallicRoughness === undefined ? undefined : textures[metallicRoughness];
    const albedoColor: vec4 = gltfMat.pbrMetallicRoughness?.baseColorFactor ?? [
      0.0, 0.0, 0.0, 1.0,
    ];
    const metallicFactor = gltfMat.pbrMetallicRoughness?.metallicFactor ?? 1;
    const roughnessFactor = gltfMat.pbrMetallicRoughness?.roughnessFactor ?? 1;
    const material = new Material();
    material.albedo = albedoTexture;
    material.normal = normalTexture;
    material.occlusion = occlusionTexture;
    material.metallicRoughness = metRoughTexture;
    material.albedoColor = [albedoColor[0], albedoColor[1], albedoColor[2]];
    material.metallicFactor = metallicFactor;
    material.roughnessFactor = roughnessFactor;
    material.alphaMode = gltfMat.alphaMode === "BLEND" ? "blend" : "opaque";
    materials.push(material);
  }
  return materials;
}

type MeshData = {
  primitives: Array<{
    indices: Accessor;
    data: Record<string, Accessor>;
    material?: Material;
  }>;
};
function parseMeshes(
  gltfFile: GLTFFile,
  accessors: Accessor[],
  materials: Material[]
) {
  const meshes: MeshData[] = [];
  for (const gltfMesh of gltfFile.meshes) {
    const mesh: MeshData = { primitives: [] };
    for (const gltfPrimitive of gltfMesh.primitives) {
      const primitive: MeshData["primitives"][0] = {
        indices: accessors[gltfPrimitive.indices],
        data: {},
      };
      if (gltfPrimitive.material !== undefined) {
        primitive.material = materials[gltfPrimitive.material];
      }
      mesh.primitives.push(primitive);
      for (const gltfAttrib of Object.entries(gltfPrimitive.attributes)) {
        const [name, idx] = gltfAttrib;
        const accessor = accessors[idx];
        primitive.data[name] = accessor;
      }
    }
    meshes.push(mesh);
  }

  return meshes;
}

function setupMeshes(webgl: WebGL, data: MeshData[]) {
  const meshes: Mesh[] = [];
  for (const mesh of data) {
    const primitives: MeshPrimitive[] = [];
    for (const prim of mesh.primitives) {
      const buffers: VertexArrayConfig["buffers"] = [];
      const position = prim.data["POSITION"];
      const uvs = prim.data["TEXCOORD_0"];
      const normals = prim.data["NORMAL"];
      const tangents = prim.data["TANGENT"];
      if (position) {
        buffers.push({
          name: "a_position",
          stride: getCountOf(position.type),
          data: new Float32Array(position.buffer),
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
        });
      } else {
        throw new Error("model had no vertex position data");
      }
      if (uvs) {
        buffers.push({
          name: "a_uv",
          stride: getCountOf(uvs.type),
          data: new Float32Array(uvs.buffer),
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
        });
      }
      if (normals) {
        buffers.push({
          name: "a_normal",
          stride: getCountOf(normals.type),
          data: new Float32Array(normals.buffer),
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
        });
      }
      if (tangents) {
        buffers.push({
          name: "a_tangent",
          stride: getCountOf(tangents.type),
          data: new Float32Array(tangents.buffer),
          type: WebGL2RenderingContext.FLOAT,
          normalized: false,
        });
      }
      const vao = webgl.createVertexArray({
        drawType: WebGL2RenderingContext.STATIC_DRAW,
        buffers,
      });
      let indices: IndexBuffer | undefined;
      if (prim.indices) {
        indices = webgl.createIndexBuffer({
          drawType: WebGL2RenderingContext.STATIC_DRAW,
          data: new Uint16Array(prim.indices.buffer),
        });
      }
      let material: Material | undefined;
      if (prim.material) {
        material = prim.material;
      }
      primitives.push(new MeshPrimitive(vao, indices, material));
    }
    meshes.push(new Mesh(primitives));
  }
  return meshes;
}

async function parseBuffers(
  gltfFile: GLTFFile,
  path: string
): Promise<ArrayBuffer[]> {
  const buffers: ArrayBuffer[] = [];
  for (const gltfBuffer of gltfFile.buffers) {
    const uri = gltfBuffer.uri;
    if (uri.startsWith("data:")) {
      const binRes = await fetch(uri);
      const buffer = await binRes.arrayBuffer();
      buffers.push(buffer);
      continue;
    }
    const binRes = await fetch(`${path}/${uri}`);
    const buffer = await binRes.arrayBuffer();
    buffers.push(buffer);
  }
  return buffers;
}

function parseBufferViews(gltfFile: GLTFFile, buffers: Array<ArrayBuffer>) {
  const views: ArrayBuffer[] = [];
  for (const gtlfView of gltfFile.bufferViews) {
    const buffer = buffers[gtlfView.buffer];
    if (buffer) {
      const view = buffer.slice(
        gtlfView.byteOffset ?? 0,
        (gtlfView.byteOffset ?? 0) + gtlfView.byteLength
      );
      views.push(view);
      continue;
    }
    throw new Error(`unable to find buffer with index: ${gtlfView.buffer}`);
  }

  return views;
}

function parseAccessors(gltfFile: GLTFFile, views: Array<ArrayBuffer>) {
  const accessors: Array<Accessor> = [];
  for (const gltfAccessor of gltfFile.accessors) {
    const comp = getAccessorComponentTypeName(gltfAccessor.componentType);
    if (gltfAccessor.bufferView === undefined) {
      throw new Error(`unable to parse accessor without a bufferview`);
    }
    const view = views[gltfAccessor.bufferView];
    if (view) {
      const { type, byteOffset, count } = gltfAccessor;
      const length = count * getSizeOf(comp, type);
      const accessor = {
        component: comp,
        type,
        buffer: view.slice(byteOffset ?? 0, (byteOffset ?? 0) + length),
      };
      accessors.push(accessor);
      continue;
    }
    throw new Error(
      `unable to find bufferView with index: ${gltfAccessor.bufferView}`
    );
  }

  return accessors;
}

function getAccessorComponentTypeName(type: number): AccessorComponentType {
  switch (type) {
    case 5126:
      return "float";
    case 5123:
      return "unsigned_short";
    default:
      return "float";
  }
}

function getSizeOf(comp: AccessorComponentType, type: AccessorType): number {
  switch (comp) {
    case "float":
      return 4 * getCountOf(type);
    case "unsigned_short":
      return 2 * getCountOf(type);
  }
}

function getCountOf(type: AccessorType): number {
  switch (type) {
    case "SCALAR":
      return 1;
    case "VEC2":
      return 2;
    case "VEC3":
      return 3;
    case "VEC4":
      return 4;
    case "MAT2":
      return 4;
    case "MAT3":
      return 9;
    case "MAT4":
      return 16;
    default:
      throw new Error(`unknown accessor type: "${type}"`);
  }
}

function getSamplerValue(value: number): number {
  switch (value) {
    case 9728:
      return WebGL2RenderingContext.NEAREST;
    case 9729:
      return WebGL2RenderingContext.LINEAR;
    case 9984:
      return WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST;
    case 9985:
      return WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST;
    case 9986:
      return WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR;
    case 9987:
      return WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR;
    case 33071:
      return WebGL2RenderingContext.CLAMP_TO_EDGE;
    case 33648:
      return WebGL2RenderingContext.MIRRORED_REPEAT;
    case 10497:
      return WebGL2RenderingContext.REPEAT;
    default:
      throw new Error(`unknown sampler value: ${value}`);
  }
}
