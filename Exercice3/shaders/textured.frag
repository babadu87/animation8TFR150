uniform sampler2D uTexture;
varying highp vec2 vTexUV;

void main(void) {
  gl_FragColor = texture2D(uTexture, vTexUV);
}
