<template>
  <div class="shadow-wrapper"><canvas ref="shadowCanvas"></canvas></div>
</template>

<script setup lang="ts">
import { onMounted, ref, render } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import bakedShadow from '../assets/shadow/bakedShadow.jpg';

const shadowCanvas = ref<HTMLCanvasElement>(null);

const initFunction = () => {
  const size = {
    width: shadowCanvas.value.clientWidth,
    height: shadowCanvas.value.clientHeight,
  };
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas: shadowCanvas.value,
  });
  renderer.setSize(size.width, size.height);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap;

  const camera = new THREE.PerspectiveCamera(
    65,
    size.width / size.height,
    1,
    100
  );
  camera.position.set(2, 2, 3);

  const material = new THREE.MeshStandardMaterial();
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: '#eee',
  });

  // add a plane
  const plane = new THREE.PlaneGeometry(3, 3);
  const planeMesh = new THREE.Mesh(plane, material);
  planeMesh.rotation.x = -Math.PI / 2;
  planeMesh.rotation.z = Math.PI * 0.2;

  // add a sphere
  const sphere = new THREE.SphereGeometry(0.3);
  const shpereMesh = new THREE.Mesh(sphere, sphereMaterial);
  shpereMesh.position.y = 0.3;

  /* shpereMesh.castShadow = true;
  planeMesh.receiveShadow = true; */

  scene.add(shpereMesh);
  scene.add(planeMesh);

  // add light
  const light = new THREE.AmbientLight('#fff');
  const directionLight = new THREE.DirectionalLight('#fff', 1.5);
  directionLight.castShadow = true;
  directionLight.position.set(1, 1, 1);

  // 优化阴影效果
  const directionCamera = directionLight.shadow.camera;
  directionCamera.far = 3;

  directionCamera.top = 2;
  directionCamera.left = -2;
  directionCamera.right = 2;
  directionCamera.bottom = -2;

  //directionLight.shadow.radius = 5;

  const directionCameraHelper = new THREE.CameraHelper(
    directionLight.shadow.camera
  );
  directionLight.shadow.mapSize.width *= 2;
  directionLight.shadow.mapSize.height *= 2;

  scene.add(light);
  scene.add(directionLight.target);
  scene.add(directionLight);
  scene.add(directionCameraHelper);

  directionCameraHelper.visible = false;

  // add helper
  const axisHelper = new THREE.AxesHelper();
  scene.add(axisHelper);

  const control = new OrbitControls(camera, renderer.domElement);

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
.shadow-wrapper,
.shadow-wrapper canvas {
  width: 100%;
  height: 100%;
}
</style>
