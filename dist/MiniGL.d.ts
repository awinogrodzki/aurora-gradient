import Mesh from './Mesh.js';
import { Uniform } from './Uniform.js';
type CommonUniforms = {
    projectionMatrix: Uniform;
    modelViewMatrix: Uniform;
    resolution: Uniform;
    aspectRatio: Uniform;
};
export default class MiniGL {
    _class: typeof MiniGL;
    private _canvas;
    private _context;
    commonUniforms: CommonUniforms;
    meshes: Array<Mesh>;
    constructor(canvas: HTMLCanvasElement, width: number | null, height: number | null);
    setCanvas(canvas: HTMLCanvasElement): void;
    getCanvas(): HTMLCanvasElement;
    getContext(): WebGLRenderingContext;
    setSize(width?: number, height?: number): void;
    setOrthographicCamera(left?: number, right?: number, top?: number, bottom?: number, distance?: number): void;
    render(): void;
}
export {};
