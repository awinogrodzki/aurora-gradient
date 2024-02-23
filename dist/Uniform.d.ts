import MiniGL from "./MiniGL.js";
export declare enum UniformType {
    Float = "float",
    Int = "int",
    Vec2 = "vec2",
    Vec3 = "vec3",
    Vec4 = "vec4",
    Mat4 = "mat4",
    Array = "array",
    Struct = "struct"
}
type DefaultProperties = {
    excludeFrom?: string;
};
export declare class FloatUniform {
    private gl;
    value: GLfloat;
    properties: DefaultProperties;
    type: UniformType.Float;
    constructor(gl: MiniGL, value: GLfloat, properties?: DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class IntUniform {
    private gl;
    value: GLint;
    properties: DefaultProperties;
    type: UniformType.Int;
    constructor(gl: MiniGL, value: GLint, properties?: DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class Vec2Uniform {
    private gl;
    value: Float32List;
    properties: DefaultProperties;
    type: UniformType.Vec2;
    constructor(gl: MiniGL, value: Float32List, properties?: DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class Vec3Uniform {
    private gl;
    value: Float32List;
    properties: DefaultProperties;
    type: UniformType.Vec3;
    constructor(gl: MiniGL, value: Float32List, properties?: DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class Vec4Uniform {
    private gl;
    value: Float32List;
    properties: DefaultProperties;
    type: UniformType.Vec4;
    constructor(gl: MiniGL, value: Float32List, properties?: DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class Mat4Uniform {
    private gl;
    value: Float32List;
    properties: {
        transpose: GLboolean;
    } & DefaultProperties;
    type: UniformType.Mat4;
    constructor(gl: MiniGL, value: Float32List, properties?: {
        transpose: GLboolean;
    } & DefaultProperties);
    update(location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export declare class ArrayUniform {
    value: Uniform[];
    properties: DefaultProperties;
    type: UniformType.Array;
    constructor(_gl: MiniGL, value: Uniform[], properties?: DefaultProperties);
    update(_location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, _length: number): string | undefined;
}
export declare class StructUniform {
    value: Record<string, Uniform>;
    properties: DefaultProperties;
    type: UniformType.Struct;
    constructor(_gl: MiniGL, value: Record<string, Uniform>, properties?: DefaultProperties);
    update(_location: WebGLUniformLocation | null): void;
    getDeclaration(name: string, type: string, length: number): string | undefined;
}
export type Uniform = FloatUniform | IntUniform | Vec2Uniform | Vec3Uniform | Vec4Uniform | Mat4Uniform | ArrayUniform | StructUniform;
export {};
