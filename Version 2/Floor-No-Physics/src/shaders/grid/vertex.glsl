
uniform float uDistance;
uniform float uDropAmount;
uniform float uDropCurveSteepness;
uniform int uNumberOfDrops;
uniform vec4 uDropLocation[4];

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // vec2 drop = uDropLocation[0];
    //Iterate over all the drop spots
    for(int i = 0; i < uNumberOfDrops; i++){
        //Get the drop coords
        vec2 drop = uDropLocation[i].xy;
        //get drop amount
        float dropDistance = uDropLocation[i].z * uDropAmount;

        //get drop k value
        float kValue = uDropLocation[i].w * uDropCurveSteepness;

        //How far away should be impacted
        float range = (dropDistance - 0.2)/2.0 * uDistance;

        float distToPoint = distance(uv, drop);
        float f = dropDistance/(1.0 + exp(-1.0*kValue*(distToPoint - range/2.0)))-dropDistance;
        modelPosition.y = modelPosition.y + (1.0-step(range, distToPoint)) * f;
    }
    
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = modelPosition.y/uDropAmount;
}