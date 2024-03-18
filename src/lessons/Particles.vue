<template>
  <div class="particles-wrapper">
    <canvas id="canvas" ref="particleCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import color from '@/particles/2.png';

const particleCanvas = ref<HTMLCanvasElement>();
const initFunction = () => {
  const size = {
    width: particleCanvas.value!.clientWidth,
    height: particleCanvas.value!.clientHeight,
  };

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas: particleCanvas.value,
  });
  renderer.setSize(size.width, size.height);

  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100
  );
  camera.position.set(2, 2, 4);
  scene.add(camera);

  const control = new OrbitControls(camera, renderer.domElement);

  // add texture
  const textureLoader = new THREE.TextureLoader();
  const colorTexture = textureLoader.load(color);

  // add particles
  // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // map: colorTexture,
    transparent: true,
    alphaMap: colorTexture, // 此时还是能看到边缘，该如何解决？有
    // 解决方案1: 设置alphaTest的值>0 The material will not be rendered if the opacity is lower than this value
    // alphaTest: 0.001,
    // 解决方案2：depthTest为true时：绘图时会检测 当前正在画的物体是否比已完成的其他物体近
    // depthTest: false,
    // 解决方案3：depthWrite: false ,disabled depth write in order to layer several things together without creating z-index artifacts
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // custom geometry use BufferGeometry
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 20000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesMaterial.vertexColors = true;

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  // add a box
  scene.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    )
  );
  scene.add(particles);

  // add animation
  const clock = new THREE.Clock();

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
.particles-wrapper,
#canvas {
  width: 100%;
  height: 100%;
}
</style>
