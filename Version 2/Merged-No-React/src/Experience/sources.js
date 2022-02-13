/* eslint import/no-anonymous-default-export: [2, {"allowArray": true}] */
export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "/textures/environmentMap/px.jpg",
      "/textures/environmentMap/nx.jpg",
      "/textures/environmentMap/py.jpg",
      "/textures/environmentMap/ny.jpg",
      "/textures/environmentMap/pz.jpg",
      "/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "/textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "/textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "/models/Fox/glTF/Fox.gltf",
  },
  {
    name: "asteroidNormalTexture",
    type: "texture",
    path: "/textures/asteroid1/normal.jpg",
  },
  {
    name: "asteroidBasecolorTexture",
    type: "texture",
    path: "/textures/asteroid1/basecolor.jpg",
  },
  {
    name: "asteroidHeightTexture",
    type: "texture",
    path: "/textures/asteroid1/height.jpg",
  },
  {
    name: "asteroidAOTexture",
    type: "texture",
    path: "/textures/asteroid1/ambientOcclusion.jpg",
  },
  {
    name: "asteroidRoughnessTexture",
    type: "texture",
    path: "/textures/asteroid1/roughness.jpg",
  },
  {
    name: "starsAttenuationTexture",
    type: "texture",
    path: "/textures/gradients/5.jpg",
  },
];
