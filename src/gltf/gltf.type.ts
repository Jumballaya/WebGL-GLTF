import { mat4, vec3, vec4 } from "gl-matrix";

export type AccessorComponentType = "float" | "unsigned_short";
export type AccessorType =
  | "SCALAR"
  | "VEC3"
  | "VEC2"
  | "VEC4"
  | "MAT2"
  | "MAT3"
  | "MAT4";
export type MeshAttributeType = "POSITION" | "NORMAL";

export type GLTFFile = {
  buffers: Array<{
    byteLength: number;
    uri: string;
  }>;
  bufferViews: Array<{
    buffer: number;
    byteLength: number;
    byteOffset: number;
    target: number;
  }>;
  accessors: Array<GTLFAccessor>;
  meshes: Array<{
    primitives: Array<{
      attributes: Record<MeshAttributeType, number>;
      indices: number;
      material?: number;
    }>;
  }>;
  nodes: Array<{
    mesh?: number;
    translation?: vec3;
    rotation?: vec3;
    scale?: vec3;
    children?: number[];
    matrix?: mat4;
  }>;
  scene: number;
  scenes: Array<{ nodes: number[] }>;
  materials?: Array<GLTFMaterial>;
  images?: Array<{ uri: string }>;
  textures?: Array<{
    sampler: number;
    source: number;
  }>;
  samplers?: Array<{
    magFilter: number;
    minFilter: number;
    wrapS: number;
    wrapT: number;
  }>;
};

type GTLFAccessor = {
  componentType: number;
  count: number;
  type: AccessorType;
  name?: string;
  bufferView?: number;
  byteOffset?: number;
  normalized?: boolean;
  min?: number[];
  max?: number[];
  sparse?: {
    count: number;
    indices: {
      bufferView: number;
      componentType: number;
      byteOffset?: number;
    };
    values: {
      bufferView: number;
      byteOffset?: number;
    };
  };
};

type GLTFTextureInfo = {
  index: number;
  texCoord?: number;
};

type GLTFMaterial = {
  name?: string;
  normalTexture?: GLTFTextureInfo;
  occlusionTexture?: GLTFTextureInfo;
  emissiveTexture?: GLTFTextureInfo;
  emissiveFactor?: vec3;
  alphaMode?: string;
  alphaCutoff?: number;
  doubleSided?: boolean;
  pbrMetallicRoughness?: {
    metallicFactor?: number;
    roughnessFactor?: number;
    metallicRoughnessTexture?: GLTFTextureInfo;
    baseColorFactor?: vec4;
    baseColorTexture?: GLTFTextureInfo;
  };
};
