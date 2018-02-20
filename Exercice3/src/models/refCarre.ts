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
    private texture: WebGLTexture;
    private textureUniform: WebGLUniformLocation;
    private TempsUniform: WebGLUniformLocation;
    private vertexUVAttrib: number;
    private temps:number;
    vsSource = 'textured.vert';
    fsSource = 'textured.frag';
    vertices = [
        0.5, 0.5, 0, 0, 1,
        0.5, -0.5, 0, 0, 0,
        -0.5, 0.5, 0, 1, 1, 
        -0.5,-0.5,0, 1, 0, 
    ];
    verticesStride = 5 * 4; // 5 composants * 32 bits
  
    updateLogic(delta: number) {
        this.temps += delta;
        if(this.temps > 1){
            this.temps -= 2;
        }
      }

    load() {
        this.temps = 0;
      this.loadTexture("img_tree");
      GL.enable(GL.BLEND);
      GL.disable(GL.DEPTH_TEST);
      return Promise.resolve();
    }
  
    postLoad(shader: WebGLProgram) {
      this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
      this.textureUniform = GL.getUniformLocation(shader, 'uTexture');
      this.TempsUniform = GL.getUniformLocation(shader, 'uTemps');
      return Promise.resolve();
    }
  
    drawSetup() {
      GL.enableVertexAttribArray(this.vertexUVAttrib);
      GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
        GL.uniform1f(this.TempsUniform, this.temps);
      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, this.texture);
      GL.uniform1i(this.textureUniform, 0);
      GL.enable(GL.BLEND);
      GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    }
  
    postDraw() {
      GL.disableVertexAttribArray(this.vertexUVAttrib);
      GL.disable(GL.BLEND);
      GL.enable(GL.DEPTH_TEST);
    }
  
    private loadTexture(name: string) {
      const image = document.getElementById(name) as HTMLImageElement;
      this.texture = GL.createTexture();
      GL.bindTexture(GL.TEXTURE_2D, this.texture);
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
      GL.bindTexture(GL.TEXTURE_2D, null);
    }
  }
