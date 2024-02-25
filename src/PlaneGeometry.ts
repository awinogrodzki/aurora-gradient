import Attribute from './Attribute';
import MiniGL from './MiniGL';

export type PlaneGeometryProperties = {
    width?: number;
    height?: number;
    orientation?: Orientation;
}

export interface PlaneGeometryAttributes {
    position: Attribute;
    uv: Attribute;
    uvNorm: Attribute;
    index: Attribute;
}

type Orientation = 'xz';

export default class PlaneGeometry {

    private gl: MiniGL;

    public attributes: PlaneGeometryAttributes;
    public width?: number;
    public height?: number;
    public orientation?: Orientation;

    private xSegCount: number = 0;
    private ySegCount: number = 0;
    private vertexCount: number = 0;
    private quadCount: number = 0;

    constructor(minigl: MiniGL, width: number, height: number, n: number, i: number, orientation: Orientation, properties: PlaneGeometryProperties = {}) {

        this.width = properties.width;
        this.height = properties.height;
        this.orientation = properties.orientation;
        this.gl = minigl;

        const context = this.gl.getContext();

        context.createBuffer();

        this.attributes = {
            position: new Attribute(this.gl, {
                target: context.ARRAY_BUFFER,
                size: 3
            }),
            uv: new Attribute(this.gl, {
                target: context.ARRAY_BUFFER,
                size: 2
            }),
            uvNorm: new Attribute(this.gl, {
                target: context.ARRAY_BUFFER,
                size: 2
            }),
            index: new Attribute(this.gl, {
                target: context.ELEMENT_ARRAY_BUFFER,
                size: 3,
                type: context.UNSIGNED_SHORT
            })
        };

        this.setTopology(n, i);
        this.setSize(width, height, orientation);
    }

    setTopology(e = 1, t = 1) {
        this.xSegCount = e;
        this.ySegCount = t;
        this.vertexCount = (this.xSegCount + 1) * (this.ySegCount + 1);
        this.quadCount = this.xSegCount * this.ySegCount * 2;
        this.attributes.uv.values = new Float32Array(2 * this.vertexCount);
        this.attributes.uvNorm.values = new Float32Array(2 * this.vertexCount);
        this.attributes.index.values = new Uint16Array(3 * this.quadCount);

        for (let e = 0; e <= this.ySegCount; e++) {
            for (let t = 0; t <= this.xSegCount; t++) {
                const i = e * (this.xSegCount + 1) + t;
                if (this.attributes.uv.values[2 * i] = t / this.xSegCount, this.attributes.uv.values[2 * i + 1] = 1 - e / this.ySegCount, this.attributes.uvNorm.values[2 * i] = t / this.xSegCount * 2 - 1, this.attributes.uvNorm.values[2 * i + 1] = 1 - e / this.ySegCount * 2, t < this.xSegCount && e < this.ySegCount) {
                    const s = e * this.xSegCount + t;
                    this.attributes.index.values[6 * s] = i, this.attributes.index.values[6 * s + 1] = i + 1 + this.xSegCount, this.attributes.index.values[6 * s + 2] = i + 1, this.attributes.index.values[6 * s + 3] = i + 1, this.attributes.index.values[6 * s + 4] = i + 1 + this.xSegCount, this.attributes.index.values[6 * s + 5] = i + 2 + this.xSegCount
                }
            }
        }

        this.attributes.uv.update();
        this.attributes.uvNorm.update();
        this.attributes.index.update();
    }

    setSize(width = 1, height = 1, orientation: Orientation = 'xz') {
        this.width = width;
        this.height = height;
        this.orientation = orientation;

        this.attributes.position.values && this.attributes.position.values.length === 3 * this.vertexCount || (this.attributes.position.values = new Float32Array(3 * this.vertexCount));
        const o = width / -2;
        const r = height / -2;
        const segment_width = width / this.xSegCount;
        const segment_height = height / this.ySegCount;

        for (let yIndex = 0; yIndex <= this.ySegCount; yIndex++) {
            const t = r + yIndex * segment_height;
            for (let xIndex = 0; xIndex <= this.xSegCount; xIndex++) {
                const r = o + xIndex * segment_width;
                const l = yIndex * (this.xSegCount + 1) + xIndex;

                this.attributes.position.values[3 * l + 'xyz'.indexOf(orientation[0])] = r;
                this.attributes.position.values[3 * l + 'xyz'.indexOf(orientation[1])] = -t;
            }
        }

        this.attributes.position.update();
    }

}
