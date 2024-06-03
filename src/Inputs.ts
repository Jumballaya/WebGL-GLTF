export class Inputs {
  private _inputs: Record<string, boolean> = {};

  private mouseCallbacks: Array<(e: MouseEvent) => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    document.body.addEventListener("keydown", (e) => {
      this._inputs[e.key] = true;
    });

    document.body.addEventListener("keyup", (e) => {
      this._inputs[e.key] = false;
    });

    canvas.addEventListener("click", async () => {
      await canvas.requestPointerLock();
      await canvas.requestFullscreen();
    });

    canvas.addEventListener("mousemove", (e) => {
      for (const cb of this.mouseCallbacks) {
        cb(e);
      }
    });
  }

  public setMouseCallback(mouseCallback: (e: MouseEvent) => void) {
    this.mouseCallbacks.push(mouseCallback);
  }

  public isPressed(key: string) {
    return this._inputs[key] === true;
  }
}
