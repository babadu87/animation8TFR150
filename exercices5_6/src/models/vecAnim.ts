import { GL, BaseModel } from './modelTemplate';
import { loadShader } from '../shaderLoad';
import { mat4, vec3, quat } from 'gl-matrix';
import { loadAsync } from '../main';
import { Bone_Anim, Scene, Bone_Movement, scene_Anim } from './vecAnimScenario';

// Fonction pour générer un modèle de debug avec squelette. Tres brut.
function generateModel(vert: number[], ind: number[], skel: Skeleton) {
  skel.pushBone(vec3.fromValues(0.2, 0, 0), quat.create());
  for (let b = 0; b < 5; b++) {
    if (b < 4) {
      let offset = vec3.fromValues(0.4, 0, 0);
      skel.pushBone(offset, quat.create());
    }

    for (let i = 0; i < 10; i++) {
      const absIdx = b * 10 + i;
      const u = absIdx / 50;
      const x = u * 2;

      // Tâtonnement avec une calculatrice graphique...
      const scaledY = Math.sqrt(1 - Math.pow(Math.log(1.1 - u), 2));
      const y = 0.125 * scaledY;
      const bone1 = b;
      const bone2 = b+1;
      const boneW2 = i/10;
      const boneW1 = 1 - boneW2;
      vert.push(
        x, -y, 0, u, 0.5 - scaledY / 2, bone1, bone2, boneW1, boneW2,
        x, y, 0, u, 0.5 + scaledY / 2, bone1, bone2, boneW1, boneW2
      );
      if (absIdx > 0) {
        ind.push(
          absIdx * 2 - 2, absIdx * 2 - 1, absIdx * 2,
          absIdx * 2 - 1, absIdx * 2, absIdx * 2 + 1
        );
      }
    }
  }
}

function getMousePos(evt:MouseEvent) {
  var rect = GL.canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function loadTexture(name: string) {
  const image = document.getElementById(name) as HTMLImageElement;
  let texture = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, texture);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
  GL.bindTexture(GL.TEXTURE_2D, null);
  return texture;
}

class DrawDebug {
  private shader: WebGLProgram;
  private vertexPositionAttrib: number;
  private boneIdxAttrib: number;
  private boneWeightAttrib: number;
  private pUniform: WebGLUniformLocation;
  private mvUniform: WebGLUniformLocation;
  private bones: WebGLUniformLocation;

  constructor(private owner: VectorAnim, private skeleton: Skeleton) {}

  load() {
    return loadShader('shaders/debugSkin.vert', 'shaders/debugSkin.frag')
      .then((shader) => {
        this.shader = shader;
        GL.useProgram(this.shader);
        this.vertexPositionAttrib = GL.getAttribLocation(this.shader, 'aVertexPosition');
        this.boneIdxAttrib = GL.getAttribLocation(this.shader, 'aBoneIdx');         // SKINNING
        this.boneWeightAttrib = GL.getAttribLocation(this.shader, 'aBoneWeight');   // SKINNING
        this.pUniform = GL.getUniformLocation(this.shader, 'uPMatrix');
        this.mvUniform = GL.getUniformLocation(this.shader, 'uMVMatrix');
        this.bones = GL.getUniformLocation(this.shader, 'uBones');                  // SKINNING
      });
  }

  draw(vertexBuffer: WebGLBuffer, projection: mat4) {
    GL.clear(GL.DEPTH_BUFFER_BIT);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    GL.useProgram(this.shader);

    GL.enableVertexAttribArray(this.vertexPositionAttrib);
    GL.vertexAttribPointer(this.vertexPositionAttrib, 3, GL.FLOAT, false, this.owner.verticesStride, 0);
    GL.enableVertexAttribArray(this.boneIdxAttrib);                                                       // SKINNING
    GL.vertexAttribPointer(this.boneIdxAttrib, 2, GL.FLOAT, false, this.owner.verticesStride, 5 * 4);     // SKINNING
    GL.enableVertexAttribArray(this.boneWeightAttrib);                                                    // SKINNING
    GL.vertexAttribPointer(this.boneWeightAttrib, 2, GL.FLOAT, false, this.owner.verticesStride, 7 * 4);  // SKINNING

    GL.uniformMatrix4fv(this.pUniform, false, projection);
    GL.uniformMatrix4fv(this.mvUniform, false, this.owner.modelView);
    GL.uniformMatrix4fv(this.bones, false, this.skeleton.toArray());                                      // SKINNING

    GL.drawArrays(GL.POINTS, 0, this.owner.vertices.length / 9);

    GL.disableVertexAttribArray(this.vertexPositionAttrib);
  }
}

class Skeleton {
  boneTranslation: mat4[] = [];
  boneRotation: mat4[] = [];
  boneInverse: mat4[] = [];
  elapsed: number = 0;
  Bone_Anim_Angle_Inc: number[] = [0,0,0,0,0];
  Bone_Anim_Angle: number[] = [0,0,0,0,0];
  pushBone(position: vec3, orientation: quat) {
    const newTrans = mat4.create();
    mat4.fromTranslation(newTrans, position);
    this.boneTranslation.push(newTrans);

    const newRot = mat4.create();
    mat4.fromQuat(newRot, orientation);
    this.boneRotation.push(newRot);
    
    const boneMat = mat4.create();
    mat4.mul(boneMat, newTrans, newRot);

    const invBone = mat4.create();
    mat4.invert(invBone, boneMat);
    let parent = mat4.create();
    if (this.boneInverse.length > 0)
      parent = this.boneInverse[this.boneInverse.length-1];
    mat4.multiply(invBone, invBone, parent);
    this.boneInverse.push(invBone);
  }

  update(delta: number) {
    
    for (let [i, b] of this.boneRotation.entries()) {
      //let angle = (document.getElementById(`bone_${i}`) as HTMLInputElement).valueAsNumber;
      //mat4.fromZRotation(b, angle * Math.PI / 180);
      this.elapsed +=  delta;
      if(scene_Anim.scene[i].bone_Movement.length > 0 && this.elapsed >= scene_Anim.scene[i].bone_Movement[0].time){
        this.Bone_Anim_Angle_Inc[i] = scene_Anim.scene[i].bone_Movement.shift().angle_inc;
      }
      this.Bone_Anim_Angle[i] += this.Bone_Anim_Angle_Inc[i]*delta;
      mat4.fromZRotation(b, this.Bone_Anim_Angle[i] * Math.PI / 180);
    }
  }

  onMouseMove(coord:{x:number, y:number}) {
    console.log(`Curseur: (${coord.x},${coord.y})`);
  }

  toArray() {
    const vals: number[] = [];
    let cumul = mat4.create();
    for (let i = 0; i < this.boneTranslation.length; ++i) {
      let inv = mat4.create();
      mat4.mul(cumul, cumul, this.boneRotation[i]);
      mat4.mul(cumul, cumul, this.boneTranslation[i]);
      mat4.mul(inv, cumul, this.boneInverse[i]);
      vals.push(...inv.values());
    }
    return [].concat(...vals);
  }
}

export class VectorAnim extends BaseModel {
  private texture: WebGLTexture;
  private textureUniform: WebGLUniformLocation;
  private vertexUVAttrib: number;
  private boneIdxAttrib: number;
  private boneWeightAttrib: number;
  private bones: WebGLUniformLocation;
  private skeleton = new Skeleton();
  private debug: DrawDebug;

  modelView = mat4.fromTranslation(mat4.create(), vec3.fromValues(-1,0,0));
  vsSource = 'skinned.vert';
  fsSource = 'textured.frag';
  vertices:number[] = [];
  indices:number[] = [];
  verticesStride = 9 * 4; // 9 composants * 32 bits

  constructor() {
    super();
    generateModel(this.vertices, this.indices, this.skeleton);
    this.debug = new DrawDebug(this, this.skeleton);
  }

  load() {
    this.texture = loadTexture("img_tentacle");
    GL.canvas.onmousemove = (evt:MouseEvent) => {
      this.skeleton.onMouseMove(getMousePos(evt));
    };
    return this.debug.load();
  }

  postLoad(shader: WebGLProgram) {
    this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
    this.boneIdxAttrib = GL.getAttribLocation(shader, 'aBoneIdx');        // SKINNING
    this.boneWeightAttrib = GL.getAttribLocation(shader, 'aBoneWeight');  // SKINNING
    this.textureUniform = GL.getUniformLocation(shader, 'uTexture');
    this.bones = GL.getUniformLocation(shader, 'uBones');                 // SKINNING
    return Promise.resolve();
  }

  updateLogic(delta: number) {
    this.skeleton.update(delta);
  }

  drawSetup() {
    GL.enableVertexAttribArray(this.vertexUVAttrib);
    GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, this.verticesStride, 3 * 4);
    GL.enableVertexAttribArray(this.boneIdxAttrib);                                                 // SKINNING
    GL.vertexAttribPointer(this.boneIdxAttrib, 2, GL.FLOAT, false, this.verticesStride, 5 * 4);     // SKINNING
    GL.enableVertexAttribArray(this.boneWeightAttrib);                                              // SKINNING
    GL.vertexAttribPointer(this.boneWeightAttrib, 2, GL.FLOAT, false, this.verticesStride, 7 * 4);  // SKINNING

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.texture);
    GL.uniform1i(this.textureUniform, 0);

    GL.uniformMatrix4fv(this.bones, false, this.skeleton.toArray());                                // SKINNING
  }

  postDraw() {
    GL.disableVertexAttribArray(this.vertexUVAttrib);
    GL.disableVertexAttribArray(this.boneIdxAttrib);                                                // SKINNING
    GL.disableVertexAttribArray(this.boneWeightAttrib);                                             // SKINNING
  }

  debugDraw(vertexBuffer: WebGLBuffer, projection: mat4) {
    this.debug.draw(vertexBuffer, projection);
  }

};