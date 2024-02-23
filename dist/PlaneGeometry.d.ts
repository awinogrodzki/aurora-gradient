import Attribute from './Attribute.js';
import MiniGL from './MiniGL.js';
export type PlaneGeometryProperties = {
    width?: number;
    height?: number;
    orientation?: Orientation;
};
export interface PlaneGeometryAttributes {
    position: Attribute;
    uv: Attribute;
    uvNorm: Attribute;
    index: Attribute;
}
type Orientation = 'xz';
export default class PlaneGeometry {
    private gl;
    attributes: PlaneGeometryAttributes;
    width?: number;
    height?: number;
    orientation?: Orientation;
    private xSegCount;
    private ySegCount;
    private vertexCount;
    private quadCount;
    constructor(minigl: MiniGL, width: number, height: number, n: number, i: number, orientation: Orientation, properties?: PlaneGeometryProperties);
    setTopology(e?: number, t?: number): void;
    setSize(width?: number, height?: number, orientation?: Orientation): void;
}
export {};
