uniform sampler2D uTextureRegion;
uniform sampler2D uTextureAltitude;
varying highp vec2 vTexUV;
void main(void) {
  highp vec4 Height = texture2D(uTextureRegion, vTexUV);
  gl_FragColor = texture2D(uTextureAltitude, vec2((Height[0]),0));
}