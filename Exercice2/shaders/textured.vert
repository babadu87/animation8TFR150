attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying highp vec2 vTexUV;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTexUV = aVertexUV;
}
