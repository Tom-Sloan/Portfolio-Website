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
    name: "projectsTextGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/projects/projectsText.glb",
  },
  {
    name: "resumeTextGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/papers/resumeText.glb",
  },
  {
    name: "contactTextGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/contact/contactText.glb",
  },
  {
    name: "hoverPlatformColor",
    type: "texture",
    path: "/static/models/destinations/tech_pedestal/tech_pedestal_COL.png",
  },
  {
    name: "hoverPlatformEmit",
    type: "texture",
    path: "/static/models/destinations/tech_pedestal/tech_pedestal_EMIT.png",
  },
  {
    name: "hoverPlatformMettalic",
    type: "texture",
    path: "/static/models/destinations/tech_pedestal/tech_pedestal_METALLIC.png",
  },
  {
    name: "hoverPlatformRoughness",
    type: "texture",
    path: "/static/models/destinations/tech_pedestal/tech_pedestal_ROUGHNESS.png",
  },
  {
    name: "pedestalGLTFModel",
    type: "gltfModel",
    path: "/static/models/destinations/tech_pedestal/tech_pedestal.glb",
  },
  {
    name: "papersGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/papers/papers.glb",
  },
  {
    name: "papersTexture",
    type: "texture",
    path: "/static/models/destinations/papers/papers.jpg",
  },
  {
    name: "projectsGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/projects/birdCompressed.glb",
  },
  {
    name: "contactGTLFModel",
    type: "gltfModel",
    path: "/static/models/destinations/contact/contact.glb",
  },
];
