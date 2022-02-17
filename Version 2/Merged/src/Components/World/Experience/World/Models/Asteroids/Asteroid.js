import * as THREE from "three";
import Experience from "../../../Experience.js";
import gsap from "gsap";
import vertexShader from "../../shaders/asteroids/vertex.js";
import fragmentShader from "../../shaders/asteroids/fragment.js";

export default class Asteroid {
  constructor(speed, lineVisibility, index) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;
    this.physics = this.experience.world.physics;
    this.user = this.experience.world.fox.model;
    this.size = this.experience.sizes;

    this.asteroidTextures = [];
    this.speed = speed || 0.001;
    this.percentageOnCurve = 0;
    this.initalLineVisibility = lineVisibility;
    this.name = "asteroid-" + index;
    this.collisionDistance = 5;
    this.isColliding = null;
    this.collidedWith = null;
    this.explosion = this.resources.items.asteroidExplosionTexture;

    this.endPoint = null;
    this.startPoint = null;
    this.path = null;
    this.line = null;
    this.lineGeometry = null;
    this.lineMaterial = null;

    this.addTextures();
    this.generatePath();
    this.generated = this.generate();
  }

  addTextures() {
    this.asteroidTextures.push({
      key: "transparent",
      value: true,
    });
    this.asteroidTextures.push({
      key: "opacity",
      value: 1,
    });
    this.asteroidTextures.push({
      key: "map",
      value: this.resources.items.asteroidBasecolorTexture,
    });
    this.asteroidTextures.push({
      key: "displacementScale",
      value: 0.7,
    });
    this.asteroidTextures.push({
      key: "displacementMap",
      value: this.resources.items.asteroidHeightTexture,
    });
    this.asteroidTextures.push({
      key: "normalMap",
      value: this.resources.items.asteroidNormalTexture,
    });
    this.asteroidTextures.push({
      key: "aoMap",
      value: this.resources.items.asteroidAOTexture,
    });
    this.asteroidTextures.push({
      key: "aoMapIntensity",
      value: 1,
    });
    this.asteroidTextures.push({
      key: "roughnessMap",
      value: this.resources.items.asteroidRoughnessTexture,
    });
  }

  posOrNegOne() {
    return Math.round(Math.random()) === 0 ? -1 : 1;
  }

  distanceToUser(point) {
    return Math.sqrt(
      Math.pow(point.x - this.user.position.x, 2) +
        Math.pow(point.y - this.user.position.z, 2)
    );
  }

  generatePath() {
    //removes points if there are alreay there
    if (this.line !== null) {
      this.lineGeometry.dispose();
      this.lineMaterial.dispose();
      this.scene.remove(this.line);
    }

    this.startPoint =
      this.endPoint === null
        ? this.getEndPoint()
        : this.distanceToUser({
            x: this.instance.position.x,
            y: this.instance.position.z,
          }) < this.planes.planeInfo.creationBoundary
        ? { x: this.instance.position.x, y: this.instance.position.z }
        : this.getEndPoint();
    this.endPoint = this.getEndPoint();

    this.path = new THREE.Path([this.startPoint]);

    const curveType = Math.floor(Math.random() * 10);

    if (curveType < 4) {
      this.path.bezierCurveTo(
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        this.endPoint.x,
        this.endPoint.y
      );
    } else if (curveType < 8) {
      this.path.quadraticCurveTo(
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne(),
        this.endPoint.x,
        this.endPoint.y
      );
    } else {
      this.path.lineTo(this.endPoint.x, this.endPoint.y);
    }

    const points = this.path.getPoints();

    this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: "green",
    });

    this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
    this.line.visible = this.initalLineVisibility;
    this.line.rotateX(Math.PI / 2);
    this.scene.add(this.line);
  }

  getEndPoint() {
    const point = new THREE.Vector2(0, 0);
    const xOrz = Math.round(Math.random());
    let valueFull = (this.planes.planeInfo.size / 2) * this.posOrNegOne();
    let valueRandom =
      (this.planes.planeInfo.size / 2) * Math.random() * this.posOrNegOne();

    // X starting point
    if (xOrz) {
      point.x = valueFull + this.user.position.x;
      point.y = valueRandom + this.user.position.z;

      // Z starting Point
    } else {
      point.x = valueRandom + this.user.position.x;
      point.y = valueFull + this.user.position.z;
    }

    return point;
  }

  generate() {
    //Add to floors so shaders can access
    this.index = this.planes.increaseNumberOfDrops();

    //Check that it can be added
    if (this.index === -1) {
      console.log("exceeded max objects, cant add");
      return false;
    }
    //Creating asteroid
    this.radius = Math.max(Math.random(), 0.25) * 5;
    this.geometry = new THREE.IcosahedronGeometry(1, 4);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uExplosion: {
          value: this.explosion,
        },
        uTime: {
          value: 0.0,
        },
        uResolution: {
          value: new THREE.Vector2(this.size.width, this.size.height),
        },
      },
    });
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.x = this.radius;
    this.instance.scale.y = this.radius;
    this.instance.scale.z = this.radius;
    this.instance.position.set(this.startPoint.x, 0, this.startPoint.y);
    this.instance.name = this.name;

    //this.instance Params
    // this.instance.castShadow = true;
    // this.instance.receiveShadow = true;
    // this.asteroidTextures.forEach(
    //   (n) => (this.instance.material[n.key] = n.value)
    // );

    //Adding Asteroid
    this.scene.add(this.instance);

    //update shader
    // drop amount, k value, the range
    this.info = {
      x: 0.2 + this.radius * 2,
      y: 1,
      z: this.radius * 5,
    };
    this.planes.updateDropsInfo(this.index, this.info);
    this.planes.updateDrops(this.index, this.instance.position);

    this.setPhysics();
    return true;
  }
  setPhysics() {
    this.physics.generateNewBody(
      this.name,
      "asteroid",
      {
        x: this.instance.position.x,
        y: this.instance.position.z,
      },
      this.radius,
      this.instance,
      (collidedWith) => this.onCollision(collidedWith)
    );
  }

  completeMovement(instance) {
    instance.percentageOnCurve = 2;
    instance.collidedWith = null;
  }
  onCollision(collidedWith) {
    if (this.collidedWith === null) {
      this.collidedWith = collidedWith;
    } else if (this.collidedWith.name === collidedWith.name) {
      return;
    }

    // console.log(
    //   this.distanceToUser({
    //     x: this.instance.position.x,
    //     y: this.instance.position.z,
    //   }) < this.planes.planeInfo.creationBoundary,
    //   this.distanceToUser({
    //     x: this.instance.position.x,
    //     y: this.instance.position.z,
    //   }),
    //   this.planes.planeInfo.creationBoundary
    // );
    // console.log(this.name + " exploded");

    let direction = collidedWith.mesh.position.clone();
    //get the vector to the instance we are colliding with
    // console.log(collidedWith, this.instance);
    direction.sub(this.instance.position);
    // console.log(direction);
    // get opposite direction to collision
    direction.normalize();
    // console.log(direction);
    direction.multiplyScalar(-1.0 * this.collisionDistance);
    // console.log(direction);
    gsap.to(this.instance.position, {
      overwrite: "auto",
      duration: 2.6,
      ease: "power2",
      x: this.instance.position.x + direction.x,
      z: this.instance.position.z + direction.z,
      onUpdate: this.updateMovement,
      onUpdateParams: [this],
      onComplete: this.completeMovement,
      onCompleteParams: [this],
    });
    gsap.to(this.instance.position, {
      overwrite: "auto",
      duration: 0.1,
      ease: "linear",
      y: 8,
    });
    gsap.to(this.instance.position, {
      overwrite: "auto",
      duration: 2.5,
      ease: "elastic.out(5, 0.2)",
      y: 0,
    });
  }
  updateMovement(instance) {
    instance.planes.updateDrops(instance.index, instance.instance.position);
    instance.physics.updatePosition(instance.name, instance.instance.position);
  }
  updatePosition(location) {
    this.instance.position.copy(location);
    this.planes.updateDrops(this.index, this.instance.position);
    this.physics.updatePosition(this.name, this.instance.position);
  }

  update() {
    if (!this.collidedWith) {
      this.percentageOnCurve += this.speed;
      if (this.percentageOnCurve > 1) {
        this.percentageOnCurve = 0;
        this.generatePath();
      }
      const point = this.path.getPoint(this.percentageOnCurve);
      const location = new THREE.Vector3(point.x, 0, point.y);
      this.updatePosition(location);
    }
    this.material.uniforms.uTime.value = (this.time.elapsed / 1000) * 0.025;
    // console.log(this.material.uniforms);
  }

  resize() {
    this.material.uniforms.uResolution.value.x = this.size.width;
    this.material.uniforms.uResolution.value.y = this.size.height;
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.instance);
    this.planes.removeIndex(this.index);
  }
}
