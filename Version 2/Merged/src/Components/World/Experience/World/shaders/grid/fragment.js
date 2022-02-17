export default `// Grid Controls
varying vec2 vUv;
uniform float uGridDensity;

uniform int uGridType;

// // For point display
// uniform vec2 uIntersectionPoints[2];
// uniform int uNumberOfDrops;


//Grid Color Controls
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uOpacityMultiplier;

varying float vElevation;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main()
{
    
    //Generate Opaccity

    float strength = 0.0;
    if(uGridType == 0){
        strength = mod(vUv.x * uGridDensity, 1.0);
        float yDir =  mod(vUv.y * uGridDensity, 1.0);
        strength = step(0.9, strength) + step(0.9, yDir);
    } else if(uGridType == 1){
        float barX = step(0.4, mod(vUv.x * uGridDensity*0.5 - 0.2, 1.0)) * step(0.8, mod(vUv.y * uGridDensity*0.5, 1.0));
        float barY = step(0.8, mod(vUv.x * uGridDensity*0.5, 1.0)) * step(0.4, mod(vUv.y * uGridDensity*0.5 - 0.2, 1.0));
        strength = barX + barY;
    }    
    
    strength = clamp(strength, 0.0, 1.0);

    //Get Color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // vec3 blackColor = vec3(0.0);
    // vec3 uvColor = vec3(vUv, 1.0);
    // vec3 uvColorMixed = mix(blackColor, uvColor, strength);
    // Create IntersectionPoints
    // for(int i = 0; i < uNumberOfDrops; i++){
    //     vec2 drop = uIntersectionPoints[i];
    //     float distToPoint = distance(vUv, drop);
    //     if(distToPoint < 0.02){
    //         color = color = vec3(0.8*strength, 0.2*strength, 0.2*strength);
    //     }
    // }
    

    // gl_FragColor =  vec4(vec3(0.6), 1.0 ) ;
    gl_FragColor =  vec4(color, strength * uOpacityMultiplier) ;
}`;
