# Loading GLTF

[Test this out yourself](https://jumballaya.github.io/WebGL-GLTF/)

You can move with the mouse to look around, wasd to move around, space to move up and c to move down

Process:

Check out the `loadGTLF.ts` file in `src/gltf` to see how I parsed the `.gltf` JSON file. I did not create a reader for `.glb` and will probably do that in another project at a future time.

Shaders:

- `basic`: just draws the normals
- `gltf`: this uses the Material class created for the `.gltf` file material properties
- `skybox`: this is for drawing the skybox

WebGL:

All of the base WebGL calls are confined to the `src/gl` folder and are abstracted behind the `WebGL` class

Renderer:

The renderer classes build on top of the webgl classes, providing a camera, light, material, mesh, etc.
