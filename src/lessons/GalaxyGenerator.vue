<template>
  <div class="galaxy-generator"><canvas ref="canvasDom"></canvas></div>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';

const canvasDom = ref();

const initFunction = () => {
  const size = {
    width: canvasDom.value.clientWidth,
    height: canvasDom.value.clientHeight,
  };
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasDom.value,
  });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    1,
    100
  );
  camera.position.z = 4;
  scene.add(camera);

  const control = new OrbitControls(camera, renderer.domElement);

  const generatorGalaxy = () => {
    const points = new THREE.BufferGeometry();
    const count = 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 4;
      positions[i3 + 2] = (Math.random() - 0.5) * 4;
    }
    points.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointMesh = new THREE.Points(
      points,
      new THREE.PointsMaterial({
        size: 0.02,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(pointMesh);
  };
  generatorGalaxy();

  const tick = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};

onMounted(() => {
  initFunction();
});
</script>

<style scoped>
.galaxy-generator,
.galaxy-generator canvas {
  width: 100%;
  height: 100%;
}
</style>
