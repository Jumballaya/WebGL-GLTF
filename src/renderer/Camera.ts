import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../gl/Shader";

export class Camera {
  public matrix = mat4.create();
  public projection = mat4.create();

  public position: vec3 = [0, 0, 0];
  private front: vec3 = [0, 0, -1];
  private up: vec3 = [0, 1, 0];
  private right: vec3 = [0, 0, 0];
  private worldUp: vec3 = [0, 1, 0];

  private yaw = -89;
  private pitch = 0;

  private moveSpeed = 1;
  private sensitivity = 0.05;
  // private zoom = 45;

  constructor() {
    this.updateCameraVectors();
  }

  public updateShader(shader: Shader, withPosition = false) {
    shader.uniform("u_view_matrix", {
      type: "mat4",
      value: this.matrix,
    });
    shader.uniform("u_projection_matrix", {
      type: "mat4",
      value: this.projection,
    });
    if (withPosition) {
      shader.uniform("u_view_position", {
        type: "vec3",
        value: this.position,
      });
    }
  }

  public move(
    dir: "left" | "right" | "forward" | "backward" | "up" | "down",
    dt: number
  ): void {
    switch (dir) {
      case "left":
        this.moveLeft(dt);
        break;
      case "right":
        this.moveRight(dt);
        break;
      case "forward":
        this.moveForward(dt);
        break;
      case "backward":
        this.moveBackward(dt);
        break;
      case "up":
        this.moveUp(dt);
        break;
      case "down":
        this.moveDown(dt);
        break;
    }
    this.updateCameraVectors();
  }

  public moveTo(pos: vec3) {
    vec3.copy(this.position, pos);
    this.updateCameraVectors();
  }

  public lookAt(pos: vec3) {
    mat4.lookAt(this.matrix, this.position, pos, this.up);
  }

  public handleMouse(x: number, y: number) {
    const xoffset = x * this.sensitivity;
    const yoffset = y * this.sensitivity;

    this.yaw += xoffset;
    this.pitch += yoffset;
    if (this.pitch > 89) {
      this.pitch = 89;
    }
    if (this.pitch < -89) {
      this.pitch = -89;
    }

    this.updateCameraVectors();
  }

  private moveLeft(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.sub(this.position, this.position, [
      this.right[0] * vel,
      this.right[1] * vel,
      this.right[2] * vel,
    ]);
  }

  private moveRight(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.add(this.position, this.position, [
      this.right[0] * vel,
      this.right[1] * vel,
      this.right[2] * vel,
    ]);
  }

  private moveForward(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.add(this.position, this.position, [
      this.front[0] * vel,
      this.front[1] * vel,
      this.front[2] * vel,
    ]);
  }

  private moveBackward(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.sub(this.position, this.position, [
      this.front[0] * vel,
      this.front[1] * vel,
      this.front[2] * vel,
    ]);
  }

  private moveUp(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.add(this.position, this.position, [0, vel, 0]);
  }

  private moveDown(dt: number) {
    const vel = this.moveSpeed * dt;
    vec3.sub(this.position, this.position, [0, vel, 0]);
  }

  protected updateCameraVectors() {
    const front = vec3.create();
    front[0] = Math.cos(radians(this.yaw)) * Math.cos(radians(this.pitch));
    front[1] = Math.sin(radians(this.pitch));
    front[2] = Math.sin(radians(this.yaw)) * Math.cos(radians(this.pitch));
    vec3.normalize(this.front, front);
    vec3.normalize(
      this.right,
      vec3.cross(vec3.create(), this.front, this.worldUp)
    );
    vec3.normalize(this.up, vec3.cross(vec3.create(), this.right, this.front));
    mat4.lookAt(
      this.matrix,
      this.position,
      vec3.add(vec3.create(), this.position, this.front),
      this.up
    );
  }
}

export class OrthographicCamera extends Camera {
  constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    super();
    mat4.ortho(this.projection, left, right, bottom, top, near, far);
    this.updateCameraVectors();
  }

  public updateShader(shader: Shader, withPosition = false) {
    shader.uniform("u_view_matrix", {
      type: "mat4",
      value: this.matrix,
    });
    shader.uniform("u_projection_matrix", {
      type: "mat4",
      value: this.projection,
    });
    if (withPosition) {
      shader.uniform("u_view_position", {
        type: "vec3",
        value: this.position,
      });
    }
  }
}

export class PerspectiveCamera extends Camera {
  private fov: number;
  private aspect: number;
  private near = 0.001;
  private far = 2000;

  constructor(fov: number, aspect: number) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    mat4.perspective(
      this.projection,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
    this.updateCameraVectors();
  }

  public updateShader(shader: Shader, withPosition = false) {
    shader.uniform("u_view_matrix", {
      type: "mat4",
      value: this.matrix,
    });
    shader.uniform("u_projection_matrix", {
      type: "mat4",
      value: this.projection,
    });
    if (withPosition) {
      shader.uniform("u_view_position", {
        type: "vec3",
        value: this.position,
      });
    }
  }
}

function radians(deg: number): number {
  return (Math.PI * deg) / 180;
}
