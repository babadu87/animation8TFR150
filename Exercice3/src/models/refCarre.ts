import { GL, BaseModel } from './modelTemplate';
import { mat4, vec4, vec3 } from 'gl-matrix';

export class RefCarre extends BaseModel {
    private translation = 0;
    private CouleurLoc: WebGLUniformLocation;
    vsSource = 'base.vert';
    fsSource = 'base.frag';
    vertices = [
        0.5, 0.5, 0,
        0.5, -0.5, 0,
        -0.5, 0.5, 0,
        -0.5,-0.5,0,
    ];
    verticesStride = 3 * 4; // 3 composants * 32 bits
    indices = [0, 1, 2, 1, 2, 3];
    updateLogic(delta: number) {
        this.translation += delta;
        
        mat4.fromTranslation(this.modelView,vec3.fromValues(Math.sin(this.translation),-Math.sin(this.translation),0));
        
      }
    postLoad(shader: WebGLProgram) {
        this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
        return Promise.resolve();
      }
    
    drawSetup() {
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(0.0, 0.0, 1.0, 1.0));
    }

};

export class TexturedCarre extends RefCarre {
    private textures: WebGLTexture[];
    private textureUniform: WebGLUniformLocation;
    private textureUniform_Deform: WebGLUniformLocation;
    private TempsUniform: WebGLUniformLocation;
    private vertexUVAttrib: number;
    private temps:number;
    private tempsPreCalc:number;
    vsSource = 'textured.vert';
    fsSource = 'textured.frag';
    vertices = [
        0.5, 0.5, 0, 1, 1,
        0.5, -0.5, 0, 1, 0,
        -0.5, 0.5, 0, 0, 1, 
        -0.5,-0.5,0, 0, 0, 
    ];
    verticesStride = 5 * 4; // 5 composants * 32 bits
  
    updateLogic(delta: number) {
        this.tempsPreCalc += delta;
        this.temps = Math.sin(this.tempsPreCalc);
      }

    load() {
        this.temps = this.tempsPreCalc = 0;
      this.textures = new Array<WebGLTexture>();
      this.loadTexture(["img_tree", "img_deformation"]);
      GL.enable(GL.BLEND);
      GL.disable(GL.DEPTH_TEST);
      return Promise.resolve();
    }
  
    postLoad(shader: WebGLProgram) {
      this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
      this.textureUniform = GL.getUniformLocation(shader, 'uTexture');
      this.textureUniform_Deform = GL.getUniformLocation(shader, 'uTextureDeform');
      this.TempsUniform = GL.getUniformLocation(shader, 'uTemps');
      return Promise.resolve();
    }
  
    drawSetup() {
      GL.enableVertexAttribArray(this.vertexUVAttrib);
      GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
        GL.uniform1f(this.TempsUniform, this.temps);
      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, this.textures[0]);
      GL.uniform1i(this.textureUniform, 0);
      GL.activeTexture(GL.TEXTURE1);
      GL.bindTexture(GL.TEXTURE_2D, this.textures[1]);
      GL.uniform1i(this.textureUniform_Deform, 1);
      GL.enable(GL.BLEND);
      GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    }
  
    postDraw() {
      GL.disableVertexAttribArray(this.vertexUVAttrib);
      GL.disable(GL.BLEND);
      GL.enable(GL.DEPTH_TEST);
    }
  
    private loadTexture(name: string[]) {
      let image: any;
      let texture: WebGLTexture;
      for(let i:number = 0; i < name.length; i++){
        image = document.getElementById(name[i]) as HTMLImageElement;
        texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.bindTexture(GL.TEXTURE_2D, null);
        this.textures.push(texture);
      }
    }
  }

  export class HeightMapCarre extends RefCarre {
    private textures: WebGLTexture[];
    private textureUniform_Altitude: WebGLUniformLocation;
    private textureUniform_Region: WebGLUniformLocation;
    private TempsUniform: WebGLUniformLocation;
    private vertexUVAttrib: number;
    private angle:number = 0;
    vsSource = 'heightmap.vert';
    fsSource = 'heightmap.frag';
    /*vertices = [
        0.5, 0, 0.5, 0, 1,
        0.5, 0, -0.5, 0, 0,
        -0.5, 0, 0.5, 1, 1, 
        -0.5, 0, -0.5, 1, 0, 
    ];*/
    vertices:number[];
    verticesStride = 5 * 4; // 5 composants * 32 bits
  constructor(){
    super();
    this.vertices = [];
    this.indices = [];
    this.Mesh(10);
  }
    Mesh(Division:number){
      let Increm = 1/Division;
      let i:number = 0;
      for(let x:number = 0; x<Division; x++){
        for(let z:number = 0; z<Division; z++, i++){
      this.vertices.push(0.5-(x*Increm), 0, 0.5-(z*Increm), 1-(x*Increm), 1-(z*Increm),
        0.5-(x*Increm), 0, (0.5-Increm)-(z*Increm), 1-(x*Increm), (1-Increm)-(z*Increm),
        (0.5-Increm)-(x*Increm), 0, 0.5-(z*Increm), (1-Increm)-(x*Increm), 1-(z*Increm), 
        (0.5-Increm)-(x*Increm), 0, (0.5-Increm)-(z*Increm), (1-Increm)-(x*Increm), (1-Increm)-(z*Increm));
        this.indices.push(0+(4*i), 1+(4*i), 2+(4*i), 1+(4*i), 2+(4*i), 3+(4*i));
        }
        
      }
    }
    load() {
      
      this.textures = new Array<WebGLTexture>();
      this.loadTexture(["img_terrain", "img_altitude"]);
      GL.enable(GL.BLEND);
      GL.disable(GL.DEPTH_TEST);
      return Promise.resolve();
    }

    updateLogic(delta: number) {
      this.angle += delta;
      mat4.fromYRotation(this.modelView,this.angle);
    }
    postLoad(shader: WebGLProgram) {
      this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
      this.textureUniform_Altitude = GL.getUniformLocation(shader, 'uTextureAltitude');
      this.textureUniform_Region = GL.getUniformLocation(shader, 'uTextureRegion');
      return Promise.resolve();
    }
  
    drawSetup() {
      GL.enableVertexAttribArray(this.vertexUVAttrib);
      GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, this.textures[0]);
      GL.uniform1i(this.textureUniform_Region, 0);
      GL.activeTexture(GL.TEXTURE1);
      GL.bindTexture(GL.TEXTURE_2D, this.textures[1]);
      GL.uniform1i(this.textureUniform_Altitude, 1);
      GL.enable(GL.BLEND);
      GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    }
  
    postDraw() {
      GL.disableVertexAttribArray(this.vertexUVAttrib);
      GL.disable(GL.BLEND);
      GL.enable(GL.DEPTH_TEST);
    }
  
    private loadTexture(name: string[]) {
      let image: any;
      let texture: WebGLTexture;
      for(let i:number = 0; i < name.length; i++){
        image = document.getElementById(name[i]) as HTMLImageElement;
        texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.bindTexture(GL.TEXTURE_2D, null);
        this.textures.push(texture);
      }
    }
  }
