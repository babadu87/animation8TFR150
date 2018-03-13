attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D uTextureRegion;
varying highp vec2 vTexUV;

void main() {
    highp vec4 Height = texture2D(uTextureRegion, aVertexUV);
    highp float Soften = 2.0;
  gl_Position = uPMatrix * uMVMatrix * vec4(vec3(aVertexPosition[0],aVertexPosition[1]-(Height[0]/Soften),aVertexPosition[2]), 1.0);
  vTexUV = aVertexUV;
}