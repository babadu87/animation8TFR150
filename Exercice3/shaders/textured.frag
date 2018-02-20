uniform sampler2D uTexture;
varying highp vec2 vTexUV;
uniform mediump float uTemps;
void main(void) {
  gl_FragColor = texture2D(uTexture, vec2(vTexUV[0]+uTemps, vTexUV[1]));
}
