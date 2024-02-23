import MiniGL from "./MiniGL.js";

export type AttributeProperties = {
  size?: number;
  target?: number;
  type?: number;
}

export default class Attribute {
  private gl: MiniGL;
  private type: number;
  private buffer: WebGLBuffer | null;
  private normalized = false;
  public properties: AttributeProperties;
  public values?: Float32Array | Uint16Array;


  constructor(minigl: MiniGL, properties: AttributeProperties = {}) {
    this.properties = properties
    this.gl = minigl;
    this.type = this.properties.type ?? this.gl.getContext().FLOAT;
    this.buffer = this.gl.getContext().createBuffer();

    this.update();
  }

  update() {
    if (typeof this.values !== 'undefined' && typeof this.properties.target !== 'undefined') {
      const context = this.gl.getContext();
      context.bindBuffer(this.properties.target, this.buffer);
      context.bufferData(this.properties.target, this.values, context.STATIC_DRAW);
    }
  }

  attach(name: string, program: WebGLProgram): number {
    const context = this.gl.getContext();
    const n = context.getAttribLocation(program, name);

    if (this.properties.target === context.ARRAY_BUFFER && typeof this.properties.size !== 'undefined') {
      context.enableVertexAttribArray(n);
      context.vertexAttribPointer(n, this.properties.size, this.type, this.normalized, 0, 0);
    }

    return n;
  }

  use(index: number) {
    const context = this.gl.getContext();

    if (typeof this.properties.target !== 'undefined') {
      context.bindBuffer(this.properties.target, this.buffer);
    }

    if (this.properties.target === context.ARRAY_BUFFER && typeof this.properties.size !== 'undefined') {
      context.enableVertexAttribArray(index);
      context.vertexAttribPointer(index, this.properties.size, this.type, this.normalized, 0, 0);
    }
  }
}
