import * as THREE from "three";
import Experience from "../../Experience.js";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export default class Floor {
  constructor(location, size, name) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }
    this.location = location;
    this.size = size;
    this.name = name;

    this.depthColor = "#0373b0";
    this.surfaceColor = "#057dc7";

    this.setGeometry();
    this.setShaders();
    // this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setShaders() {
    this.vertexShader = `
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
}`;
    this.fragmentShader = `// Grid Controls
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
}`;
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(this.size, this.size);
    this.geometry.computeBoundsTree({ lazyGeneration: false });
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
    // this.material = new THREE.MeshStandardMaterial({
    //   map: this.textures.color,
    //   normalMap: this.textures.normal,
    // });
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uDistance: { value: 1 },
        uDropAmount: { value: 1 },
        uDropCurveSteepness: { value: 20 },
        uNumberOfDrops: { value: 1 },
        //uv coord, drop amount, k value
        uDropLocation: {
          value: [
            new THREE.Vector4(0.5, 0.5, 0.5, 30.0),
            new THREE.Vector4(0.1, 0.1, 0.5, 30.0),
            new THREE.Vector4(0.9, 0.9, 0.5, 30.0),
            new THREE.Vector4(0.1, 0.1, 0.5, 30.0),
          ],
        },
        uGridDensity: { value: 30.0 },
        uIntersectionPoints: {
          value: [new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5)],
        },

        //Color Controls
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    // this.mesh.receiveShadow = true;
    this.setName(this.name);
    this.setPosition(this.location);
    this.scene.add(this.mesh);
  }

  setPosition(location) {
    this.mesh.position.set(location.x, location.y, location.z);
  }
  setName(name) {
    this.mesh.name = name;
  }
}
