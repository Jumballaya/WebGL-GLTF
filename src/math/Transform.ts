import { mat4, vec3 } from "gl-matrix";

export class Transform {
  private _translation: vec3;
  private _rotation: vec3;
  private _scale: vec3;

  private _matrix: mat4;

  constructor() {
    this._translation = vec3.create();
    this._rotation = vec3.create();
    this._scale = vec3.fromValues(1, 1, 1);
    this._matrix = mat4.create();
  }

  public get translation(): vec3 {
    return this._translation;
  }

  public set translation(t: vec3) {
    this._translation[0] = t[0];
    this._translation[1] = t[1];
    this._translation[2] = t[2];
    this.updateMatrix();
  }

  public get rotation(): vec3 {
    return this._rotation;
  }

  public set rotation(t: vec3) {
    this._rotation[0] = t[0];
    this._rotation[1] = t[1];
    this._rotation[2] = t[2];
    this.updateMatrix();
  }

  public get scale(): vec3 {
    return this._scale;
  }

  public set scale(t: vec3) {
    this._scale[0] = t[0];
    this._scale[1] = t[1];
    this._scale[2] = t[2];
    this.updateMatrix();
  }

  public get matrix(): mat4 {
    return this._matrix;
  }

  public get invMatrix(): mat4 {
    const mat = mat4.create();
    mat4.invert(mat, this._matrix);
    return mat;
  }

  public get invTrans(): mat4 {
    const mat = mat4.create();
    mat4.translate(mat, mat, this._translation);
    mat4.rotateX(mat, mat, this._rotation[0]);
    mat4.rotateY(mat, mat, this._rotation[1]);
    mat4.rotateZ(mat, mat, this._rotation[2]);
    mat4.invert(mat, mat);
    mat4.transpose(mat, mat);
    return mat;
  }

  public fromMatrix(matrix: mat4) {
    this._matrix = matrix;
  }

  public clone(): Transform {
    const trans = new Transform();
    trans.translation = this.translation;
    trans.rotation = this.rotation;
    trans.scale = this.scale;
    return trans;
  }

  public add(transform: Transform) {
    vec3.add(this._translation, this._translation, transform.translation);
    vec3.add(this._rotation, this._rotation, transform.rotation);
    vec3.mul(this._scale, this._scale, transform.scale);
    this.updateMatrix();
  }

  private updateMatrix() {
    mat4.identity(this._matrix);
    mat4.translate(this._matrix, this._matrix, this._translation);
    mat4.rotateX(this._matrix, this._matrix, this._rotation[0]);
    mat4.rotateY(this._matrix, this._matrix, this._rotation[1]);
    mat4.rotateZ(this._matrix, this._matrix, this._rotation[2]);
    mat4.scale(this._matrix, this._matrix, this._scale);
  }
}
