import { GL, BaseModel } from './modelTemplate';
import { mat4, vec4, vec3 } from 'gl-matrix';

export class RefParabole extends BaseModel {
  private angle = 100;
    protected CouleurLoc: WebGLUniformLocation;
  vsSource = 'base.vert';
  fsSource = 'base.frag';
  vertices:number[] = [];
  
  verticesStride = 3*4;// 3 composants * 32 bits
  indices:number[] = [];
  private equation(X:number):number{
    return -(Math.pow(X, 2))+1;
  }
  constructor(){
      super();
      let NbSommetsCalc:number = 10;
      let CptSommet:number = 0;
      let SemiLargeur:number = 1.0;
    for(let i:number = -NbSommetsCalc; i<=NbSommetsCalc; i++){
        this.vertices.push(SemiLargeur*(i/NbSommetsCalc), this.equation(SemiLargeur*(i/NbSommetsCalc)), 0.0);
        CptSommet++;
    }
    this.vertices.push(0.0, this.equation(SemiLargeur), 0.0);
    let o:number=0, j:number=1;
    for(let i:number = 0; i<CptSommet-1; i++, j++){
        this.indices.push(CptSommet, j, j-1);
    }
    mat4.fromTranslation(this.modelView, vec3.fromValues(0.0, -(this.equation(0)/2), 0.0));
  }
  postLoad(shader: WebGLProgram) {
    this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
    return Promise.resolve();
  }

  drawSetup() {
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(1.0, 1.0, 0.0, 1.0));
  }
};
export class ParaboleAnime extends RefParabole{
  vsSource = 'oscille.vert';
  fsSource = 'oscille.frag';
  private dy:number;
  private DeltaLoc:WebGLUniformLocation;
  constructor(){
    super();
    this.dy = 0;
  }
  postLoad(shader: WebGLProgram) {
    this.DeltaLoc = GL.getUniformLocation(shader, 'uDelta');
    this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
    
    return Promise.resolve();
  }
  updateLogic(delta:number){
    this.dy += delta;
    //mat4.fromTranslation(this.modelView, vec3.fromValues(0.0, Math.sin(this.dy), 0.0));
  }
  drawSetup() {
    GL.uniform1f(this.DeltaLoc, this.dy);
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(1.0, 1.0, 0.0, 1.0));
  }
}