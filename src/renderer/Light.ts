import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../gl/Shader";

export class Light {
  private _position: vec3 = [0, 0, 0];
  public color: vec3 = [1, 1, 1];
  public intensity = 1;

  public constant = 1;
  public linear = 0.09;
  public quadratic = 0.032;

  public model = mat4.create();
  public view = mat4.create();
  public projection = mat4.create();

  constructor() {
    mat4.ortho(this.projection, -10, 10, -10, 10, 1, 30);
  }

  public get position(): vec3 {
    return this._position;
  }

  public set position(v: vec3) {
    this._position = v;
    mat4.translate(this.model, mat4.create(), this.position);
    mat4.scale(this.model, this.model, [0.1, 0.1, 0.1]);
  }

  public lookAt(pos: vec3) {
    mat4.lookAt(this.view, this.position, pos, [0, 1, 0]);
  }

  public updateShader(shader: Shader) {
    shader.uniform("u_light.position", {
      type: "vec3",
      value: this.position,
    });
    shader.uniform("u_light.color", {
      type: "vec3",
      value: this.color,
    });
    shader.uniform("u_light.intensity", {
      type: "float",
      value: this.intensity,
    });
    shader.uniform("u_light.constant", {
      type: "float",
      value: this.constant,
    });
    shader.uniform("u_light.linear", {
      type: "float",
      value: this.linear,
    });
    shader.uniform("u_light.quadratic", {
      type: "float",
      value: this.quadratic,
    });
  }
}
