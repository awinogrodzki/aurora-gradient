import Material from "./Material";
import MiniGL from "./MiniGL";
import PlaneGeometry from "./PlaneGeometry";
export type MeshProperties = {};
export default class Mesh {
    private gl;
    wireframe: boolean;
    private attributeInstances;
    geometry: PlaneGeometry;
    material: Material;
    properties: MeshProperties;
    constructor(minigl: MiniGL, geometry: PlaneGeometry, material: Material, properties?: MeshProperties);
    draw(): void;
    remove(): void;
}
