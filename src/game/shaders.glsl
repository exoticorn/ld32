### vscreen
varying mediump vec2 uv;

attribute vec2 pos;

uniform vec2 psize;
uniform vec2 vsize;

void main() {
  uv = pos;
  vec2 vpos = (pos - 0.5) * vsize;
  float scale = min(psize.x / vsize.x, psize.y / vsize.y);
  vec2 ppos = vpos * scale;
  gl_Position = vec4(ppos / psize * 2.0, 0.0, 1.0);
}
---
uniform sampler2D texture;

void main() {
  gl_FragColor = texture2D(texture, uv);
}
