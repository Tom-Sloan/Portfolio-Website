varying vec2 vUv;
varying float noise;
uniform sampler2D uExplosion;
uniform float uTime;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main() {

  // get a random offset
  float r = .01 * random( vec3( 12.9898 + uTime, 78.233 + uTime, 151.7182 + uTime ), 0.0 );
  // lookup vertically in the texture, using noise and offset
  // to get the right RGB colour
  vec2 tPos = vec2( 0, 1.3 * noise + r );
  vec4 color = texture2D( uExplosion, tPos );

  gl_FragColor = vec4( color.rgb, 1.0 );

}

// uniform vec2 uResolution;
// uniform float uTime;

// void main(){
//   vec2 st = gl_FragCoord.xy/uResolution.xy;
//   st.x *= uResolution.x/uResolution.y;
//   vec3 color = vec3(0.0);
//   float d = 0.0;

//   // Remap the space to -1. to 1.
//   st = st *2.-1.;

//   // Make the distance field
//   d = length( abs(st)-.3 );
//   // d = length( min(abs(st)-.3,0.) );
//   // d = length( max(abs(st)-.3,0.) );

//   // Visualize the distance field
//   gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);

//   // Drawing with the distance field
// //   gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
// //   gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
// //   gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
// }
