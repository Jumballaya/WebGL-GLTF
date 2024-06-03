import { Inputs } from "./Inputs";
import { Camera } from "./renderer/Camera";

export class CameraFlyController {
  private camera: Camera;
  private inputs: Inputs;

  private enabled = false;

  constructor(camera: Camera, inputs: Inputs) {
    this.camera = camera;
    this.inputs = inputs;

    this.inputs.setMouseCallback((e) => {
      if (!this.enabled) return;
      camera.handleMouse(e.movementX, -e.movementY);
    });
  }

  public update(dt: number) {
    this.enabled = !!document.pointerLockElement;
    if (!this.enabled) return;

    if (this.inputs.isPressed("w")) {
      this.camera.move("forward", dt);
    }
    if (this.inputs.isPressed("s")) {
      this.camera.move("backward", dt);
    }
    if (this.inputs.isPressed("a")) {
      this.camera.move("left", dt);
    }
    if (this.inputs.isPressed("d")) {
      this.camera.move("right", dt);
    }
    if (this.inputs.isPressed(" ")) {
      this.camera.move("up", dt);
    }
    if (this.inputs.isPressed("c")) {
      this.camera.move("down", dt);
    }
  }
}
