export default `
uniform float uDropAmount;
uniform float uDropCurveSteepness;
uniform int uNumberOfDrops;
uniform vec3 uDropLocation[30];
uniform vec3 uDropInformation[30];

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // vec2 drop = uDropLocation[0];
    //Iterate over all the drop spots
    float dropEffect = 1.0;
    for(int i = 0; i < uNumberOfDrops; i++){
        //Get the drop coords
        vec3 drop = uDropLocation[i].xyz;

        //get drop amount
        float dropDistance = uDropInformation[i].x;

        //get drop k value
        float kValue = uDropInformation[i].y * uDropCurveSteepness;

        //How far away should be impacted
        float range = uDropInformation[i].z;

        float distToPoint = distance(drop.xz, modelPosition.xz );

        float f = dropDistance/(1.0 + exp(-1.0*kValue*(distToPoint - range/2.0)))-dropDistance;
        //sets the model height to be decrease by the amount in f based on distance
        modelPosition.y = modelPosition.y + (1.0-step(range, distToPoint)) * f;
        dropEffect += (1.0-step(range, distToPoint)) * dropDistance;
    }
    
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vElevation = modelPosition.y/dropEffect;
}`;
