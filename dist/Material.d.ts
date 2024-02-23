import MiniGL from './MiniGL.js';
import { Uniform } from './Uniform.js';
export type MaterialProperties = {};
export default class Material {
    private gl;
    uniformInstances: {
        uniform: Uniform;
        location: WebGLUniformLocation | null;
    }[];
    properties: MaterialProperties;
    uniforms: Record<string, Uniform>;
    private vertexSource;
    private Source;
    private vertexShader;
    private fragmentShader;
    program: WebGLProgram | null;
    constructor(minigl: MiniGL, vertexShaders: string, fragments: string, uniforms?: Record<string, Uniform>, properties?: MaterialProperties);
    _getShaderByType(type: number, source: string): WebGLShader | null;
    _getUniformVariableDeclarations(uniforms: Record<string, Uniform>, type: string): string;
    attachUniforms(name: null, uniforms: Record<string, Uniform>): void;
    attachUniforms(name: string, uniforms: Uniform): void;
}
