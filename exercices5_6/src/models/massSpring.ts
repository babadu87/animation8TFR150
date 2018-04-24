import { GL, BaseModel } from './modelTemplate';
import { loadShader } from '../shaderLoad';
import { mat4, vec3, vec4, quat, vec2 } from 'gl-matrix';
import { loadAsync } from '../main';

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
class DrawDebug {
  private shader: WebGLProgram;
  private vertexPositionAttrib: number;
  private boneIdxAttrib: number;
  private boneWeightAttrib: number;
  private pUniform: WebGLUniformLocation;
  private mvUniform: WebGLUniformLocation;
  private bones: WebGLUniformLocation;

  constructor(private owner: MassSpring) {}

  load() {
    return loadShader('shaders/massspring.vert', 'shaders/massspring.frag')
      .then((shader) => {
        this.shader = shader;
        GL.useProgram(this.shader);
        this.vertexPositionAttrib = GL.getAttribLocation(this.shader, 'aVertexPosition');
        this.pUniform = GL.getUniformLocation(this.shader, 'uPMatrix');
        this.mvUniform = GL.getUniformLocation(this.shader, 'uMVMatrix');
      });
  }

  draw(vertexBuffer: WebGLBuffer, projection: mat4) {
    GL.clear(GL.DEPTH_BUFFER_BIT);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    GL.useProgram(this.shader);

    GL.enableVertexAttribArray(this.vertexPositionAttrib);
    GL.vertexAttribPointer(this.vertexPositionAttrib, 3, GL.FLOAT, false, this.owner.verticesStride, 0);

    GL.uniformMatrix4fv(this.pUniform, false, projection);
    GL.uniformMatrix4fv(this.mvUniform, false, this.owner.modelView);                                    

    GL.drawArrays(GL.POINTS, 0, this.owner.vertices.length / 9);

    GL.disableVertexAttribArray(this.vertexPositionAttrib);
  }
}
const Mass = 1;
const Elast = 0.4;
const N = 20;
const Amort = 0.4;
;
interface Lien{
  P1: number;
  P2: number;
  LongueurNormal: number;
}
interface Point{
  X:number;
  Y:number;
  Velocite:vec2;
  Lock:boolean;
  Force:vec2;
  i:number;
}
export class MassSpring extends RefCarre {
    private textures: WebGLTexture[];
    private textureLoc: WebGLUniformLocation;
    private DeltaLoc: WebGLUniformLocation;
    private vertexUVAttrib: number;
    private normalLength:number;
    private MaxLength:number;
    private Delta:number;
    private Liens: Lien[] = [];
    private Points: Point[] = [];
     
    vsSource = 'massspring.vert';
    fsSource = 'massspring.frag';
    vertices:number[];
    private debug: DrawDebug;
    
    verticesStride = 5 * 4; // 5 composants * 32 bits
  constructor(){
    super();
    this.vertices = [];
    this.indices = [];
    this.Mesh(N);
    this.debug = new DrawDebug(this);
    
  }
  private ifLienExiste(X:number, Y:number){
    this.Points.forEach(p => {
      if(((p.Y == Y)&&(p.X == X))||((p.Y == X)&&(p.X == Y))){
        return true;
      }
    });
    return false;
  }
  Mesh(NbSommets:number){
    let Taille: number = 0.75*2;
    let PasUV = 0;
     
    let i:number = 0;
    let PasXY = 0;
    if(NbSommets >= 2){
      PasXY = Taille/(NbSommets-1);
      PasUV = 1/(NbSommets-1);
    }
    this.normalLength = PasXY;
    this.MaxLength = this.normalLength * 1.2;
    for(let x:number = 0; x<NbSommets; x++){
      for(let y:number = 0; y<NbSommets; y++){
      this.vertices.push(
        -(Taille/2)+(PasXY*x), -(Taille/2)+(PasXY*y), 0, (x*PasUV), (y*PasUV)
      );
      
      this.Points.push({X: -(Taille/2)+(PasXY*x),Y:-(Taille/2)+(PasXY*y),
        Velocite:vec2.fromValues(0,0), Lock:false, i:0, Force:vec2.fromValues(0,0)});
    }
  }
  for(let l:number=0; l<N*N; l++){
    let sib:number[] = this.getSibblings(l);
    if((l%N)==0){
      this.Points[l].Lock = true;
      
    }
    this.Points[l].i = l;
    for(let i:number = 0; i<4; i++){
      if(sib[i] != null){
        if(!this.ifLienExiste(l, sib[i])){
          this.Liens.push({P1:l, P2:sib[i], LongueurNormal: this.CalcLong(l, sib[i])});
        }
      }
    }
  }
    //indices
    for(let x:number = 0; x<NbSommets-1; x++){
      for(let y:number = 0; y<NbSommets-1; y++, i++){
        this.indices.push(i, i+NbSommets, i+NbSommets+1, i, i+NbSommets+1, i+1);
      }
      i++; 
    }
  console.log("Done");
  }
  private getSibblings(Vertex:number):number[]{
    let Top:number, Bottom:number, Left:number, Right:number;
     /*
        T
        |
    L - V - R
        |
        B
     */
    if(this.vertices[(Vertex+N)*5] != null){//right
      Right=Vertex+N;
    }else{
      Right = null;
    }
    if(this.vertices[(Vertex-N)*5] != null){//left
      Left=Vertex-N;
    }else{
      Left = null;
    }
    if(this.vertices[(Vertex-1)*5] != null){//top
      Top=Vertex-1;
    }else{
      Top = null;
    }
    if(this.vertices[(Vertex+1)*5] != null){//bottom
      Bottom=Vertex+1;
    }else{
      Bottom = null;
    }
    return [Top, Bottom, Left, Right];
  }
    load() {
      this.textures = new Array<WebGLTexture>();
      this.loadTexture(["img_tree"]);
      GL.enable(GL.BLEND);
      GL.disable(GL.DEPTH_TEST);
      return this.debug.load();
    }
    private getVertexCoords(numCarre: number, numPoint:number):number{
      return (((numCarre*4)+numPoint)*5)
    }
    updateLogic(delta: number) {
      let p = delta;
      this.Liens.forEach(l => {
        this.ComputeForceElas(l);
      });

      for(let x:number = 0; x<(N*N); x++){
        this.Simulate(this.Points[x], delta);
        this.vertices[(x*5)] = this.Points[x].X;
        this.vertices[(x*5)+1] = this.Points[x].Y;
        this.Points[x].Force = vec2.fromValues(0,0);
      }
    }
    private CalcLong(P1:number, P2:number):number{
      return Math.sqrt(Math.pow((this.Points[P2].X - this.Points[P1].X),2)+Math.pow((this.Points[P2].Y - this.Points[P1].Y),2));
    }
    private Simulate(point: Point, delta:number){
      let a:number[] = [point.Force[0]/Mass, (point.Force[1])/Mass];
      
      if(!point.Lock){
      vec2.add(point.Velocite,point.Velocite,[a[0]*delta, a[1]*delta]);
      point.Velocite[0] *= 0.99;
      point.Velocite[1] *= 0.99;
        point.X += point.Velocite[0] * delta;
        point.Y += point.Velocite[1] * delta;
      }
    }
    private ComputeForceElas(lien:Lien){
      let P1:vec2 = vec2.fromValues(this.Points[lien.P1].X,this.Points[lien.P1].Y);
      let P2:vec2 = vec2.fromValues(this.Points[lien.P2].X,this.Points[lien.P2].Y);
      let ressort: vec2 = vec2.fromValues(0,0);
      vec2.sub(ressort, P2, P1);
      let longueur:number = vec2.distance(P1,P2);
      let deplac: number = longueur - (lien.LongueurNormal);
      
      let ressortN: vec2 = vec2.fromValues(0,0);
      vec2.normalize(ressortN, ressort);
      //Damper
      let Point1:Point = this.Points[lien.P1];
      let Point2:Point = this.Points[lien.P2];
      let deltaV:vec2 = vec2.fromValues(Point2.Velocite[0]-Point1.Velocite[0],Point2.Velocite[1]-Point1.Velocite[0]);
      let damperforce:number = vec2.dot(ressortN, deltaV);
      let restoreForce:vec2 = vec2.fromValues((ressortN[0]*(deplac*Elast))+(damperforce*Amort),(ressortN[1]*(deplac*Elast))+(damperforce*Amort));
      
      vec2.add(this.Points[lien.P1].Force, this.Points[lien.P1].Force, restoreForce);
      vec2.sub(this.Points[lien.P2].Force, this.Points[lien.P2].Force, restoreForce);
      

    }
    /*
     3 - 1
     | / |
     2 - 0
    */
    postLoad(shader: WebGLProgram) {
      this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
      this.textureLoc = GL.getUniformLocation(shader, 'uTexture');
      this.DeltaLoc = GL.getUniformLocation(shader, 'uDelta');
      return Promise.resolve();
    }
  
    drawSetup() {
      GL.enableVertexAttribArray(this.vertexUVAttrib);
      GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D, this.textures[0]);
      GL.uniform1i(this.textureLoc, 0);
      GL.uniform1f(this.DeltaLoc, this.Delta);
      GL.enable(GL.BLEND);
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
    debugDraw(vertexBuffer: WebGLBuffer, projection: mat4) {
      this.debug.draw(vertexBuffer, projection);
    }
    vertexChanged() {
      return true;
    }
  }
