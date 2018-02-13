import { GL, ModeleBase } from './ModeleBase';
import { mat4 } from 'gl-matrix';
export class TriangleBase extends ModeleBase{
    private angle = 0;
    
      vsSource = 'base.vert';
      fsSource = 'base.frag';
      vertices = [
        -0.5, Math.sin(Math.PI / 3), 0,
        1, 0, 0,
        -0.5, -Math.sin(Math.PI / 3), 0,
      ];
      verticesStride = 3 * 4; // 3 composants * 32 bits
      indices = [0, 1, 2];
    
      updateLogic(delta: number) {
        this.angle += delta;
        mat4.fromZRotation(this.modelView, this.angle);
      }
}

export class TriangleDegrade extends TriangleBase{
    private ColorBuffer: WebGLBuffer;
    private DegraColorLoc: number;
    load() {
        this.loadColor();
        return Promise.resolve();
      }
    
      postLoad(shader: WebGLProgram) {
        this.DegraColorLoc = GL.getAttribLocation(shader, 'aVertexColor');
        return Promise.resolve();
      }
    
      drawSetup() {
        GL.enableVertexAttribArray(this.vertexUVAttrib);
        GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
    
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        GL.uniform1i(this.textureUniform, 0);
    
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.ONE, GL.ZERO);
      }
    
      postDraw() {
        GL.disableVertexAttribArray(this.vertexUVAttrib);
      }
    
      private loadColor() {
        const colors = [
            1.0,  0.0,  0.0,  1.0,    // rouge
            0.0,  1.0,  0.0,  1.0,    // vert
            0.0,  0.0,  1.0,  1.0,    // bleu
          ];
        
          const colorBuffer = GL.createBuffer();
          GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
          GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(colors), GL.STATIC_DRAW);
      }
}