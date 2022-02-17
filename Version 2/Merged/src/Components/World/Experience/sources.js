/* eslint import/no-anonymous-default-export: [2, {"allowArray": true}] */
export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "./static/textures/environmentMap/px.jpg",
      "./static/textures/environmentMap/nx.jpg",
      "./static/textures/environmentMap/py.jpg",
      "./static/textures/environmentMap/ny.jpg",
      "./static/textures/environmentMap/pz.jpg",
      "./static/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "./static/textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "./static/textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "/static/models/Fox/glTF/Fox.gltf",
  },
  {
    name: "particleTexture",
    type: "texture",
    path: "/static/textures/particles/4.png",
  },
  {
    name: "asteroidExplosionTexture",
    type: "texture",
    path: "/static/textures/asteroid1/explosion.png",
  },
];
