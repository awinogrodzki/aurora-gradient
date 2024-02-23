import Mesh from './Mesh.js';
import { FloatUniform, Mat4Uniform, Uniform, Vec2Uniform, } from './Uniform.js';

type CommonUniforms = {
    projectionMatrix: Uniform;
    modelViewMatrix: Uniform;
    resolution: Uniform;
    aspectRatio: Uniform;
}

export default class MiniGL {
    public _class = MiniGL;
    private _canvas!: HTMLCanvasElement;
    private _context!: WebGLRenderingContext | null;
    public commonUniforms: CommonUniforms;

    public meshes: Array<Mesh> = [];

    constructor(canvas: HTMLCanvasElement, width: number | null, height: number | null) {
        this.setCanvas(canvas)

        const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        this.commonUniforms = {
            projectionMatrix: new Mat4Uniform(this, matrix),
            modelViewMatrix: new Mat4Uniform(this, matrix),
            resolution: new Vec2Uniform(this, [1, 1], {}),
            aspectRatio: new FloatUniform(this, 1, {})
        };

        this.setSize(width ?? undefined, height ?? undefined);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = canvas.getContext('webgl', {
            antialias: true
        });
    }

    getCanvas() {
        return this._canvas;
    }

    getContext() {
        if (!this._context) {
            throw new Error('Context not available');
        }

        return this._context;
    }

    setSize(width = 640, height = 480) {
        this.getCanvas().width = width;
        this.getCanvas().height = height;
        this.getContext().viewport(0, 0, width, height);
        this.commonUniforms.resolution.value = [width, height];
        this.commonUniforms.aspectRatio.value = width / height;
    }

    setOrthographicCamera(left = 0, right = 0, top = 0, bottom = -2000, distance = 2000) {
        this.commonUniforms.projectionMatrix.value = [
            2 / this.getCanvas().width,
            0, 0, 0, 0,
            2 / this.getCanvas().height,
            0, 0, 0, 0,
            2 / (bottom - distance),
            0, left, right, top, 1
        ];
    }

    render() {
        this.getContext().clearColor(0, 0, 0, 0);
        this.getContext().clearDepth(1);
        this.meshes.forEach(mesh => {
            mesh.draw();
        });
    }
}
