import MiniGL from './MiniGL';
import { Uniform, UniformType } from './Uniform';

export type MaterialProperties = {};

function isUniform(uniforms: Record<string, Uniform> | Uniform): uniforms is Uniform {
  return Object.values(UniformType).includes((uniforms as Uniform).type);
}

export default class Material {
  private gl: MiniGL;
  public uniformInstances: { uniform: Uniform, location: WebGLUniformLocation | null }[] = [];
  public properties: MaterialProperties;
  public uniforms: Record<string, Uniform>;
  private vertexSource: string;
  private Source: string;
  private vertexShader: WebGLShader | null;
  private fragmentShader: WebGLShader | null;
  public program: WebGLProgram | null;

  constructor(minigl: MiniGL, vertexShaders: string, fragments: string, uniforms: Record<string, Uniform> = {}, properties: MaterialProperties = {}) {

    this.properties = properties;
    this.gl = minigl;
    this.uniforms = uniforms;

    const context = this.gl.getContext();

    const prefix = `
            precision highp float;
        `;

    this.vertexSource = `
            ${prefix}
            attribute vec4 position;
            attribute vec2 uv;
            attribute vec2 uvNorm;
            ${this._getUniformVariableDeclarations(this.gl.commonUniforms, "vertex")}
            ${this._getUniformVariableDeclarations(uniforms, "vertex")}
            ${vertexShaders}
        `;

    this.Source = `
            ${prefix}
            ${this._getUniformVariableDeclarations(this.gl.commonUniforms, "fragment")}
            ${this._getUniformVariableDeclarations(uniforms, "fragment")}
            ${fragments}
        `;

    this.vertexShader = this._getShaderByType(context.VERTEX_SHADER, this.vertexSource);
    this.fragmentShader = this._getShaderByType(context.FRAGMENT_SHADER, this.Source);
    this.program = context.createProgram();

    if (this.program && this.vertexShader && this.fragmentShader) {
      context.attachShader(this.program, this.vertexShader);
      context.attachShader(this.program, this.fragmentShader);
      context.linkProgram(this.program);
      context.getProgramParameter(this.program, context.LINK_STATUS) || console.error(context.getProgramInfoLog(this.program));
    }

    context.useProgram(this.program);

    this.attachUniforms(null, this.gl.commonUniforms);
    this.attachUniforms(null, this.uniforms);
  }

  _getShaderByType(type: number, source: string) {
    const context = this.gl.getContext();
    const shader = context.createShader(type);

    if (shader) {
      context.shaderSource(shader, source);
      context.compileShader(shader);

      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error(context.getShaderInfoLog(shader));
      }
    }

    return shader;
  }

  _getUniformVariableDeclarations(uniforms: Record<string, Uniform>, type: string) {
    return Object.entries(uniforms).map(([uniform, value]) => {
      return value.getDeclaration(uniform, type, 0);
    }).join("\n");
  }

  attachUniforms(name: null, uniforms: Record<string, Uniform>): void;
  attachUniforms(name: string, uniforms: Uniform): void;
  attachUniforms(name: string | null, uniforms: Record<string, Uniform> | Uniform) {
    if (!name) {
      Object.entries(uniforms).forEach(([name, uniform]) => {
        this.attachUniforms(name, uniform);
      });
    } else if (uniforms.type === UniformType.Array) {
      uniforms.value.forEach((uniform, i) => {
        this.attachUniforms(`${name}[${i}]`, uniform);
      });
    } else if (uniforms.type === 'struct') {
      Object.entries(uniforms.value).forEach(([uniform, i]) => {
        this.attachUniforms(`${name}.${uniform}`, i);
      });
    } else if (this.program && isUniform(uniforms)) {
      this.uniformInstances.push({
        uniform: uniforms,
        location: this.gl.getContext().getUniformLocation(this.program, name)
      });
    }
  }
}
