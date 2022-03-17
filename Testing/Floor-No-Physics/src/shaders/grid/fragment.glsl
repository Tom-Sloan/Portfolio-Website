// Grid Controls
varying vec2 vUv;
uniform float uGridDensity;

// For point display
uniform vec2 uIntersectionPoints[2];
uniform int uNumberOfDrops;

//Grid Color Controls
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main()
{
    
    //Generate Opaccity
    float strength = mod(vUv.x * uGridDensity, 1.0);
    float yDir =  mod(vUv.y * uGridDensity, 1.0);
    strength = step(0.9, strength) + step(0.9, yDir);

    //Get Color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);


    // Create IntersectionPoints
    for(int i = 0; i < uNumberOfDrops; i++){
        vec2 drop = uIntersectionPoints[i];
        float distToPoint = distance(vUv, drop);
        if(distToPoint < 0.02){
            color = color = vec3(0.8*strength, 0.2*strength, 0.2*strength);
        }
    }
    

    gl_FragColor =  vec4(color, strength ) ;
}