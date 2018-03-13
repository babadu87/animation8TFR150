uniform sampler2D uTexture;
uniform sampler2D uTextureDeform;
varying highp vec2 vTexUV;
uniform mediump float uTemps;
void main(void) {
  highp vec4 DeformColor = texture2D(uTextureDeform, vTexUV);
  //gl_FragColor = texture2D(uTexture, vec2(vTexUV[0]+uTemps, vTexUV[1]));
  gl_FragColor = texture2D(uTexture, vec2(vTexUV[0]+(DeformColor[0]*uTemps),vTexUV[1]+(DeformColor[1]*uTemps)));
}
