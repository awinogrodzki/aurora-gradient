import MiniGL from "./MiniGL.js";

export enum UniformType {
  Float = 'float',
  Int = 'int',
  Vec2 = 'vec2',
  Vec3 = 'vec3',
  Vec4 = 'vec4',
  Mat4 = 'mat4',
  Array = 'array',
  Struct = 'struct'
}

type DefaultProperties = {
  excludeFrom?: string;
}


function getDefaultDeclaration(type: UniformType, name: string, length: number) {
  return `uniform ${type} ${name}${length > 0 ? `[${length}]` : ''};`;
}

export class FloatUniform {
  public type: UniformType.Float = UniformType.Float;

  constructor(private gl: MiniGL, public value: GLfloat, public properties: DefaultProperties = {}) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniform1f(location, this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class IntUniform {
  public type: UniformType.Int = UniformType.Int;

  constructor(private gl: MiniGL, public value: GLint, public properties: DefaultProperties = {}) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniform1i(location, this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class Vec2Uniform {
  public type: UniformType.Vec2 = UniformType.Vec2;

  constructor(private gl: MiniGL, public value: Float32List, public properties: DefaultProperties = {}) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniform2fv(location, this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class Vec3Uniform {
  public type: UniformType.Vec3 = UniformType.Vec3;

  constructor(private gl: MiniGL, public value: Float32List, public properties: DefaultProperties = {}) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniform3fv(location, this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class Vec4Uniform {
  public type: UniformType.Vec4 = UniformType.Vec4;

  constructor(private gl: MiniGL, public value: Float32List, public properties: DefaultProperties = {}) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniform4fv(location, this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class Mat4Uniform {
  public type: UniformType.Mat4 = UniformType.Mat4;

  constructor(private gl: MiniGL, public value: Float32List, public properties: {
    transpose: GLboolean
  } & DefaultProperties = { transpose: false }) {
  }

  update(location: WebGLUniformLocation | null) {
    if (!this.value) {
      return;
    }

    this.gl.getContext()?.uniformMatrix4fv(location, this.properties.transpose,  this.value);
  }

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return getDefaultDeclaration(this.type, name, length);
  }
}

export class ArrayUniform {
  public type: UniformType.Array = UniformType.Array;

  constructor(_gl: MiniGL, public value: Uniform[], public properties: DefaultProperties = {}) {
  }

  update(_location: WebGLUniformLocation | null) {}

  public getDeclaration(name: string, type: string, _length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    return `${this.value[0]?.getDeclaration(name, type, this.value.length)}
const int ${name}_length = ${this.value.length};`;
  }
}

export class StructUniform {
  public type: UniformType.Struct = UniformType.Struct;

  constructor(_gl: MiniGL, public value: Record<string, Uniform>, public properties: DefaultProperties = {}) {
  }

  update(_location: WebGLUniformLocation | null) {}

  public getDeclaration(name: string, type: string, length: number): string | undefined {
    if (this.properties.excludeFrom === type) {
      return;
    }

    let namePrefix = name.replace('u_', '');
    namePrefix = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);

    const declaration = Object.entries(this.value).map(([name, uniform]) => {
      return uniform.getDeclaration(name, type, 0)?.replace(/^uniform/, '');
    }).join('');

    return `uniform struct ${namePrefix} {
  ${declaration}
} ${name}${length > 0 ? `[${length}]` : ''};`;
  }
}

export type Uniform = FloatUniform | IntUniform | Vec2Uniform | Vec3Uniform | Vec4Uniform | Mat4Uniform | ArrayUniform | StructUniform;
