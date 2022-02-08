
uniform float uDistance;
uniform float uDropAmount;
uniform float uDropCurveSteepness;
uniform int uNumberOfDrops;
uniform vec2 uDropLocation[4];

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // vec2 drop = uDropLocation[0];
    for(int i = 0; i < uNumberOfDrops; i++){
        vec2 drop = uDropLocation[i];
        float distToPoint = distance(uv, drop);
        float f = uDropAmount/(1.0 + exp(-1.0*uDropCurveSteepness*(distToPoint - uDistance/2.0)))-uDropAmount;
        modelPosition.y = modelPosition.y + (1.0-step(uDistance, distToPoint)) * f;
    }
    
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = modelPosition.y/uDropAmount;
}