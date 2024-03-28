<template>
  <canvas class="webgl"></canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import {
  Body,
  ContactMaterial,
  Material,
  Plane,
  Sphere,
  Vec3,
  World,
} from 'cannon';
import { onMounted } from 'vue';
import sound from '@/physics/sounds/hit.mp3';

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 20),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
    })
  );

  mesh.castShadow = true;
  mesh.position.copy(position);

  const physicsShape = new Sphere(radius);
  const physicsBody = new Body({
    shape: physicsShape,
    mass: 1,
    position: new Vec3(0, 3, 0),
  });
  physicsBody.position.copy(position);
  return {
    mesh,
    physicsBody,
  };
};
const initFunction = () => {
  /**
   * Debug
   */
  const gui = new GUI();

  /**
   * Base
   */
  // Canvas
  const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');

  // Scene
  const scene = new THREE.Scene();

  /**
   * world
   */
  const world = new World();
  world.gravity.set(0, -9.82, 0);

  const defaultMaterial = new Material('default');

  const contactMaterial = new ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );
  world.defaultContactMaterial = contactMaterial;

  // a floor in physics
  const floorShape = new Plane();
  const floorBody = new Body({
    shape: floorShape,
    mass: 0,
    // material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);

  world.addBody(floorBody);
  world.addContactMaterial(contactMaterial);

  // sphere
  const { mesh: sphereMesh, physicsBody: sphereBody } = createSphere(0.5, {
    x: 0,
    y: 3,
    z: 0,
  });
  scene.add(sphereMesh);
  world.addBody(sphereBody);

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  const environmentMapTexture = cubeTextureLoader.load([
    '../assets/physics/environmentMaps/0/px.png',
    '../assets/physics/environmentMaps/0/nx.png',
    '../assets/physics/environmentMaps/0/py.png',
    '../assets/physics/environmentMaps/0/ny.png',
    '../assets/physics/environmentMaps/0/pz.png',
    '../assets/physics/environmentMaps/0/nz.png',
  ]);

  /**
   * Floor
   */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(-3, 3, 3);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * sound
   */
  const hitSound = new Audio(sound);
  const playSound = (collision) => {
    const impact = collision.contact.getImpactVelocityAlongNormal();
    if (impact < 1.6) return;
    hitSound.play();
  };
  sphereBody.addEventListener('collide', playSound);

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let lastTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastTime;
    lastTime = elapsedTime;

    world.step(1 / 60, deltaTime, 3);

    sphereMesh.position.copy(sphereBody.position);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};

onMounted(() => {
  initFunction();
});
</script>

<style></style>
