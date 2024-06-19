import MiniGL from "./MiniGL";
import Blend from "./ShadersJs/Blend";
import Fragment from "./ShadersJs/Fragment";
import Noise from "./ShadersJs/Noise";
import Vertex from "./ShadersJs/Vertex";
import {
  ArrayUniform,
  FloatUniform,
  StructUniform,
  Uniform,
  Vec2Uniform,
  Vec3Uniform,
  Vec4Uniform,
} from "./Uniform";
import Material from "./Material";
import Mesh from "./Mesh";
import PlaneGeometry from "./PlaneGeometry";

interface GradientOptions {
  canvas: HTMLCanvasElement | null;
  colors: string[];
  onTimeUpdate?: (time: number) => void;
  wireframe?: boolean;
  density?: [number, number];
  angle?: number;
  amplitude?: number;
  time?: number;
  static?: boolean;
  loadedClass?: string;
}

export default class Gradient {
  public _class = Gradient;

  static defaultOptions: GradientOptions = {
    canvas: null,
    colors: ["#f00", "#0f0", "#00f"],
    wireframe: false,
    density: [0.06, 0.16],
    time: 1253106,
    angle: 0,
    amplitude: 320,
    static: false, // Enable non-animating gradient
    loadedClass: "is-loaded",
  };

  vertexShader: string | null = null;
  uniforms: Record<string, Uniform> = {};
  time: number = 0; // @todo work out why this number has been choosen.
  mesh: Mesh | null = null;
  material: Material | null = null;
  geometry: PlaneGeometry | null = null;

  scrollingTimeout: number | undefined = undefined;
  scrollingRefreshDelay = 200;
  width: number | null = null;
  height = 600;
  xSegCount: number | null = null;
  ySegCount: number | null = null;
  freqX = 0.00014;
  freqY = 0.00029;
  seed: number = 0;
  freqDelta = 0.00001;
  activeColors = [1, 1, 1, 1];

  private handle?: number;

  shaderFiles = {
    vertex: Vertex,
    noise: Noise,
    blend: Blend,
    fragment: Fragment,
  };

  options: GradientOptions = {
    canvas: null,
    colors: Gradient.defaultOptions.colors,
  };

  _flags: Record<string, any> = {
    playing: true,
  };

  private _canvas: HTMLCanvasElement | null = null;
  private _context: WebGLRenderingContext | null = null;

  private _minigl: MiniGL;

  constructor(options: GradientOptions) {
    this.options = options;

    this.setCanvas(
      this.findCanvas(this.getOption("canvas") as string | HTMLCanvasElement)!
    );
    this._minigl = new MiniGL(
      this.getCanvas(),
      this.getCanvas().offsetWidth,
      this.getCanvas().offsetHeight
    );
    this.time = this.getOption("time");
  }

  getOption<K extends keyof GradientOptions, T extends GradientOptions[K]>(
    name: K,
    defaultValue: T | null | undefined = undefined
  ): T {
    if (defaultValue === undefined && name in this._class.defaultOptions) {
      defaultValue = this._class.defaultOptions[name] as T;
    }

    return (name in this.options ? this.options[name] : defaultValue) as T;
  }

  findCanvas(selector: string | HTMLCanvasElement): HTMLCanvasElement | null {
    const canvas =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    return (canvas as HTMLCanvasElement) ?? null;
  }

  setCanvas(canvas: HTMLCanvasElement) {
    if (canvas) {
      this._canvas = canvas;
      this._context = canvas.getContext("webgl", {
        antialias: true,
      });
    } else {
      this._canvas = null;
      this._context = null;
    }
  }

  getCanvas() {
    if (!this._canvas) {
      throw new Error(
        "Missing Canvas. Pass the canvas to the Gradient constructor."
      );
    }

    return this._canvas;
  }

  getContext() {
    return this._context;
  }

  setFlag<T extends any>(name: string, value: T): T {
    return (this._flags[name] = value);
  }

  getFlag<T extends any>(
    name: string,
    defaultValue: T | undefined = undefined
  ): T {
    return this._flags[name] || defaultValue;
  }

  handleScroll() {
    clearTimeout(this.scrollingTimeout);
    this.scrollingTimeout = setTimeout(
      this.handleScrollEnd,
      this.scrollingRefreshDelay
    );

    if (this.getFlag("playing")) {
      this.setFlag("isScrolling", true);
      this.pause();
    }
  }

  handleScrollEnd() {
    this.setFlag("isScrolling", false);

    if (this.getFlag("isIntersecting")) {
      this.play();
    }
  }

  resize = () => {
    const [densityX, densityY] = this.getOption("density")!;
    this.width =
      this._canvas?.getBoundingClientRect().width ?? window.innerWidth;
    this.height =
      this._canvas?.getBoundingClientRect().height ?? window.innerHeight;

    this._minigl.setSize(this.width, this.height);
    this._minigl.setOrthographicCamera();
    this.xSegCount = Math.ceil(this.width * densityX);
    this.ySegCount = Math.ceil(this.height * densityY);
    this.mesh?.geometry.setTopology(this.xSegCount, this.ySegCount);
    this.mesh?.geometry.setSize(this.width, this.height);

    if (this.mesh) {
      this.mesh.material.uniforms.u_shadow_power.value =
        this.width < this.height ? 5 : 6;
    }
  };

  animate = (event: number = 0) => {
    const shouldSkipFrame =
      !!window.document.hidden ||
      !this.getFlag("playing") ||
      (typeof event === "number" ? event : parseInt(event, 10)) % 2 === 0;
    let lastFrame = this.getFlag("lastFrame", 0);

    if (!shouldSkipFrame) {
      this.time += Math.min(event - lastFrame, 1000 / 15);
      this.getOption("onTimeUpdate")?.(this.time);
      lastFrame = this.setFlag("lastFrame", event);
      if (this.mesh) {
        this.mesh.material.uniforms.u_time.value = this.time;
      }
      this._minigl.render();
    }

    // @todo support static gradient.
    if (lastFrame !== 0 && this.getOption("static")) {
      this._minigl.render();
      return this.disconnect();
    }

    if (/*this.getFlag('isIntersecting') && */ this.getFlag("playing")) {
      this.handle = requestAnimationFrame(this.animate);
    }
  };

  pause() {
    this.setFlag("playing", false);
  }

  play() {
    this.handle = requestAnimationFrame(this.animate);
    this.setFlag("playing", true);
  }

  disconnect() {
    if (this.handle) {
      cancelAnimationFrame(this.handle);
    }

    clearTimeout(this.scrollingTimeout);

    window.removeEventListener("resize", this.resize);
  }

  initMaterial() {
    /**
     * @type {array[]}
     */
    const colors = this.getOption("colors")!
      .map((hex) => {
        // Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
        if (hex.length === 4) {
          const hexTemp = hex
            .substr(1)
            .split("")
            .map((hexTemp) => hexTemp + hexTemp)
            .join("");
          hex = `#${hexTemp}`;
        }

        return hex && `0x${hex.substr(1)}`;
      })
      .filter(Boolean)
      .map(this.normalizeColor);

    this.uniforms = {
      u_time: new FloatUniform(this._minigl, 0),
      u_shadow_power: new FloatUniform(this._minigl, 10),
      u_darken_top: new FloatUniform(
        this._minigl,
        this.getCanvas().dataset.jsDarkenTop ? 1 : 0
      ),
      u_active_colors: new Vec4Uniform(this._minigl, this.activeColors),

      u_global: new StructUniform(this._minigl, {
        noiseFreq: new Vec2Uniform(this._minigl, [this.freqX, this.freqY]),
        noiseSpeed: new FloatUniform(this._minigl, 0.000005),
      }),

      u_vertDeform: new StructUniform(
        this._minigl,
        {
          incline: new FloatUniform(
            this._minigl,
            Math.sin(this.getOption("angle")) /
              Math.cos(this.getOption("angle"))
          ),
          offsetTop: new FloatUniform(this._minigl, -0.5),
          offsetBottom: new FloatUniform(this._minigl, -0.5),
          noiseFreq: new Vec2Uniform(this._minigl, [3, 4]),
          noiseAmp: new FloatUniform(this._minigl, this.getOption("amplitude")),
          noiseSpeed: new FloatUniform(this._minigl, 10),
          noiseFlow: new FloatUniform(this._minigl, 3),
          noiseSeed: new FloatUniform(this._minigl, this.seed),
        },
        {
          excludeFrom: "fragment",
        }
      ),

      u_baseColor: new Vec3Uniform(this._minigl, colors[0], {
        excludeFrom: "fragment",
      }),

      u_waveLayers: new ArrayUniform(this._minigl, [], {
        excludeFrom: "fragment",
      }),
    };

    for (let e = 1; e < colors.length; e += 1) {
      const waveLayerUniform = new StructUniform(this._minigl, {
        color: new Vec3Uniform(this._minigl, colors[e]),
        noiseFreq: new Vec2Uniform(this._minigl, [
          2 + e / colors.length,
          3 + e / colors.length,
        ]),
        noiseSpeed: new FloatUniform(this._minigl, 11 + 0.3 * e),
        noiseFlow: new FloatUniform(this._minigl, 6.5 + 0.3 * e),
        noiseSeed: new FloatUniform(this._minigl, this.seed + 10 * e),
        noiseFloor: new FloatUniform(this._minigl, 0.1),
        noiseCeil: new FloatUniform(this._minigl, 0.63 + 0.07 * e),
      });

      (this.uniforms.u_waveLayers as ArrayUniform).value.push(waveLayerUniform);
    }
    this.vertexShader = [
      this.shaderFiles.noise,
      this.shaderFiles.blend,
      this.shaderFiles.vertex,
    ].join("\n\n");

    return new Material(
      this._minigl,
      this.vertexShader,
      this.shaderFiles.fragment,
      this.uniforms
    );
  }

  initMesh() {
    this.material = this.initMaterial();
    this.geometry = new PlaneGeometry(this._minigl, 0, 0, 0, 0, "xz");

    this.mesh = new Mesh(this._minigl, this.geometry, this.material);
    this.mesh.wireframe = this.getOption("wireframe");
  }

  updateFrequency(e: number) {
    this.freqX += e;
    this.freqY += e;
  }

  toggleColor(index: number) {
    this.activeColors[index] = this.activeColors[index] === 0 ? 1 : 0;
  }

  init() {
    const loadedClass = this.getOption("loadedClass");
    if (loadedClass) {
      this.getCanvas().classList.add(loadedClass);
    }

    this.initMesh();
    this.resize();
    this.handle = requestAnimationFrame(this.animate);
    window.addEventListener("resize", this.resize);
  }

  normalizeColor(hexCode: string): number[] {
    const hex = Number(hexCode);

    return [
      ((hex >> 16) & 255) / 255,
      ((hex >> 8) & 255) / 255,
      (255 & hex) / 255,
    ];
  }
}
