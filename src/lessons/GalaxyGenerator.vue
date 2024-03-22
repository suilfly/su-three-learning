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

  let points = null,
    positions = null,
    pointMesh = null,
    insideColor = new THREE.Color('#ff6030'),
    outsideColor = new THREE.Color('#1b3984'),
    colors = null;

  const generatorGalaxy = () => {
    points = new THREE.BufferGeometry();
    const count = 100000;
    const branchs = 4;
    const radius = 5;
    const spin = 1;
    const randomness = 0.2;
    const randomPow = 3;

    positions = new Float32Array(count * 3);
    colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const branchAngle = ((i % branchs) / branchs) * 2 * Math.PI;
      const randomRadius = Math.random() * radius;
      const randomSpin = randomRadius * spin;
      const randomX =
        Math.pow(Math.random(), randomPow) *
        randomness *
        randomRadius *
        (Math.random() < 0.5 ? -1 : 1);
      const randomY =
        Math.pow(Math.random(), randomPow) *
        randomness *
        randomRadius *
        (Math.random() < 0.5 ? -1 : 1);
      const randomZ =
        Math.pow(Math.random(), randomPow) *
        randomness *
        randomRadius *
        (Math.random() < 0.5 ? -1 : 1);

      positions[i3] =
        Math.sin(branchAngle + randomSpin) * randomRadius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] =
        Math.cos(branchAngle + randomSpin) * randomRadius + randomZ;

      // 生成随机颜色
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, randomRadius / radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    points.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    pointMesh = new THREE.Points(
      points,
      new THREE.PointsMaterial({
        size: 0.01,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
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
