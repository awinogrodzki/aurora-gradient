import MiniGL from "./MiniGL.js";
export type AttributeProperties = {
    size?: number;
    target?: number;
    type?: number;
};
export default class Attribute {
    private gl;
    private type;
    private buffer;
    private normalized;
    properties: AttributeProperties;
    values?: Float32Array | Uint16Array;
    constructor(minigl: MiniGL, properties?: AttributeProperties);
    update(): void;
    attach(name: string, program: WebGLProgram): number;
    use(index: number): void;
}
