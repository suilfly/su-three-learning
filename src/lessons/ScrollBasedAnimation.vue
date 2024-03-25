<template>
  <div>
    <canvas id="scroll-based-canvas"></canvas>
    <section class="section1 section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import GUI from 'lil-gui';
import { onMounted } from 'vue';
import gsap from 'gsap';
import gradientImg from '@/scroll-based-animation/3.jpg';

const initFunction = () => {
  /**
   * Debug
   */
  const gui = new GUI();

  const parameters = {
    materialColor: '#ffeded',
  };

  gui.addColor(parameters, 'materialColor');

  /**
   * scroll
   */
  let scrollY = 0,
    cursor = {
      x: 0,
      y: 0,
    },
    currentSectionIndex = 0,
    newSectionIndex = 0;

  /**
   * Base
   */
  // Canvas
  const canvas = document.querySelector('#scroll-based-canvas');

  // Scene
  const scene = new THREE.Scene();

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  /**
   * Camera
   */
  // group
  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);

  // Base camera
  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 6;
  scene.add(camera);
  cameraGroup.add(camera);

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // texture
  const textureLoader = new THREE.TextureLoader();
  const gradientTexture = textureLoader.load(gradientImg);
  gradientTexture.magFilter = THREE.NearestFilter;

  /**
   * Objects
   * 全部都是用MeshToonMaterial
   * 官方的解释：A material implementing toon shading.
   */
  // Meshes
  const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
  });
  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
  );
  const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
  );

  // position
  const distances = 4;
  const meshes = [mesh1, mesh2, mesh3];
  meshes.forEach((mesh, index) => {
    mesh.position.y = -index * distances;
  });
  mesh1.position.x = 2;
  mesh2.position.x = -2;
  mesh3.position.x = 2;
  scene.add(mesh1, mesh2, mesh3);

  /**
   * Light
   */
  const directionLight = new THREE.DirectionalLight('#fff', 3);
  directionLight.position.set(1, 1, 0);
  scene.add(directionLight);

  /**
   * Animate
   */
  const clock = new THREE.Clock();
  let lastElapsedTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const frameTime = elapsedTime - lastElapsedTime;
    lastElapsedTime = elapsedTime;

    camera.position.y = -(scrollY / sizes.height) * 4;

    cameraGroup.position.x +=
      (cursor.x - cameraGroup.position.x) * frameTime * 5;
    cameraGroup.position.y +=
      (-cursor.y - cameraGroup.position.y) * frameTime * 5;

    /* meshes.forEach((mesh) => {
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    }); */

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
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

  window.addEventListener('scroll', (e) => {
    scrollY = window.scrollY; // 返回文档垂直方向上已滚动的Y
    newSectionIndex = Math.round(scrollY / sizes.height); // 返回四舍五入后最接近的数

    if (newSectionIndex !== currentSectionIndex) {
      currentSectionIndex = newSectionIndex;
      gsap.to(meshes[currentSectionIndex].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5',
      });
    }
  });

  window.addEventListener('mousemove', (e) => {
    cursor = {
      x: (e.clientX / sizes.width) * 0.5,
      y: (e.clientY / sizes.height) * 0.5,
    };
  });

  tick();
};

onMounted(() => {
  initFunction();
});
</script>

<style scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}
.section {
  display: flex;
  align-items: center;
  height: 100vh;
  position: relative;
  font-family: 'Cabin', sans-serif;
  color: #ffeded;
  text-transform: uppercase;
  font-size: 7vmin;
  padding-left: 10%;
  padding-right: 10%;
}

section:nth-child(odd) {
  justify-content: flex-end;
}
</style>
