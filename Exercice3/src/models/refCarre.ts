import { GL, BaseModel } from './modelTemplate';
import { mat4, vec4 } from 'gl-matrix';

export class RefCarre extends BaseModel {
    private angle = 0;
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

    postLoad(shader: WebGLProgram) {
        this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
        return Promise.resolve();
      }
    
    drawSetup() {
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(0.0, 0.0, 1.0, 1.0));
    }

};
