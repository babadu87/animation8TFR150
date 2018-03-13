attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uDelta;

void main() {
  
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y+sin(uDelta), aVertexPosition.z, 1.0);
}
