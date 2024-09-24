<template>
  <div class="text-3d"><canvas ref="canvasDom"></canvas></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import matcapImg from "../assets/matcaps/1.png";

const canvasDom = ref();
const renderFunction = () => {
  const scene = new THREE.Scene();

  const sizes = {
    with: canvasDom.value.clientWidth,
    height: canvasDom.value.clientHeight,
  };

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasDom.value,
  });
  renderer.setSize(sizes.with, sizes.height);

  // question: what fov means?
  const camera = new THREE.PerspectiveCamera(
    50,
    sizes.with / sizes.height,
    1,
    1000,
  );

  camera.position.z = 4;

  const control = new OrbitControls(camera, renderer.domElement);
  // load texture
  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load(matcapImg);

  // load font
  const fontLoader = new FontLoader();
  fontLoader.load("/static/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("hello text-geometry", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1,
    });
    // 计算text几何体的边界盒子
    textGeometry.computeBoundingBox();
    textGeometry.translate(
      -textGeometry.boundingBox.max.x / 2,
      -textGeometry.boundingBox.max.y / 2,
      -textGeometry.boundingBox.max.z / 2,
    );

    const material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);
  });

  // add random geometry
  const randomGeometry = new THREE.RingGeometry();
  const randomMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  for (let i = 0; i < 1000; i++) {
    const randomMesh = new THREE.Mesh(randomGeometry, randomMaterial);

    randomMesh.position.x = Math.random();
    randomMesh.position.y = Math.random();
    randomMesh.position.z = Math.random();
    scene.add(randomMesh);
  }

  const tick = () => {
    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();
};

onMounted(() => {
  renderFunction();
});
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}

div canvas {
  width: 100%;
  height: 100%;
}
</style>
