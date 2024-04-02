<template>
  <div class="three-container">
    <canvas></canvas>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted } from 'vue';
import gradient1 from '../assets/gradients/3.jpg';

onMounted(() => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const canvas = document.querySelector('.three-container canvas');
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);

  const camera = new THREE.PerspectiveCamera(
    70,
    sizes.width / sizes.height,
    1,
    100
  );
  camera.position.x = 2;
  camera.position.y = 2;
  camera.position.z = 2;

  const controls = new OrbitControls(camera, renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const gradientTexture1 = textureLoader.load(gradient1);

  /* const material = new THREE.MeshBasicMaterial({
    color: 'red',
  }); */

  const material = new THREE.MeshToonMaterial();
  // material.gradientMap = gradientTexture1;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
  );

  // const material = new THREE.MeshNormalMaterial();

  // material properties
  // material.wireframe = true;

  // must set the transparent property to true, otherwise the opacity will not work
  /* material.transparent = true;
  material.opacity = 0.5; */

  scene.add(sphere);

  /**
   * light
   */
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 20);
  pointLight.position.x = 2;
  pointLight.position.y = 2;
  pointLight.position.z = 3;
  scene.add(pointLight);

  const tick = () => {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
});
</script>

<style scoped>
.three-container,
.three-container canvas {
  width: 100%;
  height: 100%;
}
</style>
