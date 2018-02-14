import { GL, BaseModel } from './modelTemplate';
import { mat4 } from 'gl-matrix';
import { vec4 } from 'gl-matrix';

export class RefParabole extends BaseModel {
  private angle = 0;
    private CouleurLoc: WebGLUniformLocation;
    private SiDegrade: WebGLUniformLocation;
  vsSource = 'base.vert';
  fsSource = 'base.frag';
  vertices:number[] = [];
      /*-0.5, this.equation(-0.5), 0.0, //1
      -0.4, this.equation(-0.4), 0.0, //2
      -0.3, this.equation(-0.3), 0.0, //3
      -0.2, this.equation(-0.2), 0.0, //4
      -0.1, this.equation(-0.1), 0.0, //5
      0.0, this.equation(0.0), 0.0, //6
      0.1, this.equation(-0.1), 0.0, //7
      0.2, this.equation(-0.2), 0.0, //8
      0.3, this.equation(-0.3), 0.0, //9
      0.4, this.equation(-0.4), 0.0, //10
      0.5, this.equation(-0.5), 0.0, //11
      0.0, 0.0, 0.0 //12*/
  
  verticesStride = 3*4;// 3 composants * 32 bits
  indices:number[] = [];
  private equation(X:number):number{
    return -(2*Math.pow(X, 2))+0.5;
  }
  load() {
      let NbSommet:number = 0;
      this.vertices.push(-0.5, this.equation(-0.5), 0.0);
      NbSommet++;
    for(let i:number = -10; i<11; i++){
        this.vertices.push(0.5*(i/11), this.equation(0.5*(i/11)), 0.0);
        NbSommet++;
    }
    this.vertices.push(0.5, this.equation(0.5), 0.0);
    NbSommet++;
    this.vertices.push(0.0, 0.0, 0.0);
    let o:number=0, j:number=1;
    for(let i:number = 0; i<NbSommet-1; i++, j++){
        this.indices.push(NbSommet, j, j-1);
    }
    console.log(NbSommet);
    return Promise.resolve();
  }
  postLoad(shader: WebGLProgram) {
    this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
    //this.SiDegrade = GL.getUniformLocation(shader, 'uTexture');
    return Promise.resolve();
  }

  drawSetup() {
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(1.0, 1.0, 0.0, 1.0));
  }
  postDraw() {
    this.indices = [];
    this.vertices = [];
  }

};