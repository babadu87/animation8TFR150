attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;
attribute vec2 aBoneIdx;      // SKINNING
attribute vec2 aBoneWeight;   // SKINNING
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uBones[5];       // SKINNING

varying highp vec2 vTexUV;

void main() {
  gl_Position = uPMatrix * uMVMatrix * (uBones[int(aBoneIdx[0])]*aBoneWeight[0]+uBones[int(aBoneIdx[1])]*aBoneWeight[1]) * vec4(aVertexPosition, 1.0);
  vTexUV = aVertexUV;
}
