import Attribute from "./Attribute";
import Material from "./Material";
import MiniGL from "./MiniGL";
import PlaneGeometry from "./PlaneGeometry";

export type MeshProperties = {

}

export default class Mesh {

  private gl: MiniGL;

  public wireframe = false;
  private attributeInstances: { attribute: Attribute, location: number }[] = [];
  public geometry: PlaneGeometry;
  public material: Material;
  public properties: MeshProperties;

  constructor(minigl: MiniGL, geometry: PlaneGeometry, material: Material, properties: MeshProperties = {}) {

    this.properties = properties;

    this.geometry = geometry;
    this.material = material;
    this.gl = minigl;

    Object.entries(this.geometry.attributes).forEach(([e, attribute]) => {
      this.attributeInstances.push({
        attribute: attribute,
        location: attribute.attach(e, this.material.program)
      });
    });

    this.gl.meshes.push(this);
  }


  draw() {
    const context = this.gl.getContext();

    context.useProgram(this.material.program);

    this.material.uniformInstances.forEach(({ uniform: uniform, location: location }) => {
      uniform.update(location);
    });

    this.attributeInstances.forEach(({ attribute: attribute, location: location }) => {
      attribute.use(location);
    });

    const mode = this.wireframe ? context.LINES : context.TRIANGLES;

    if (this.geometry.attributes.index.values) {
      context.drawElements(mode, this.geometry.attributes.index.values.length, context.UNSIGNED_SHORT, 0);
    }
  }

  remove() {
    this.gl.meshes = this.gl.meshes.filter(mesh => mesh != this);
  }

}
