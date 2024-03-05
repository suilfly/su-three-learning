<template>
  <div class="three-container">
    <canvas></canvas>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted } from 'vue';

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

  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 'red',
  });
  const mesh = new THREE.Mesh(cubeGeo, material);
  scene.add(mesh);

  const tick = () => {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
});
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
