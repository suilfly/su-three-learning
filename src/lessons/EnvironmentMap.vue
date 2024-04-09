<template>
  <canvas class="webgl"></canvas>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { onMounted } from 'vue';
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js';

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {
  envMapIntensity: null,
};
global.envMapIntensity = 1;

// Scene
const scene = new THREE.Scene();

const updateAllMaterials = () => {
  scene.traverse((child: THREE.Mesh) => {
    if (
      child.isMesh &&
      isInstanceOf(child.material, THREE.MeshStandardMaterial)
    ) {
      (child.material as THREE.MeshStandardMaterial).envMapIntensity =
        global.envMapIntensity;
    }
  });
};

const isInstanceOf = (value, instance) => {
  return value instanceof instance;
};

const initFunction = () => {
  // Canvas
  const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');

  // loader
  const modelLoader = new GLTFLoader();
  const rgbeLoader = new RGBELoader();
  modelLoader.load(
    '/src/assets/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(10, 10, 10);
      scene.add(model);
      updateAllMaterials();
    }
  );

  /* const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap = cubeTextureLoader.load([
    '/src/assets/physics/environmentMaps/1/px.png',
    '/src/assets/physics/environmentMaps/1/nx.png',
    '/src/assets/physics/environmentMaps/1/py.png',
    '/src/assets/physics/environmentMaps/1/ny.png',
    '/src/assets/physics/environmentMaps/1/pz.png',
    '/src/assets/physics/environmentMaps/1/nz.png',
  ]);
  scene.background = environmentMap;
  scene.environment = environmentMap; */
  rgbeLoader.load('/src/assets/physics/environmentMaps/2k.hdr', (env) => {
    env.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = env;
    scene.environment = env;
  });

  gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials);

  scene.backgroundBlurriness = 0.2;
  scene.backgroundIntensity = 5;

  gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001);
  gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001);

  /**
   * Torus Knot
   */
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 1,
      color: 0xaaaaaa,
    })
  );
  torusKnot.position.y = 4;
  torusKnot.position.x = -4;
  scene.add(torusKnot);

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
  camera.position.set(4, 5, 4);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.target.y = 3.5;
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  const tick = () => {
    // Time
    const elapsedTime = clock.getElapsedTime();

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

<style scoped></style>
