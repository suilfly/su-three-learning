<template>
  <div class="shadow-wrapper"><canvas ref="shadowCanvas"></canvas></div>
</template>

<script setup lang="ts">
import { onMounted, ref, render } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import bakedShadow from '../assets/shadow/bakedShadow.jpg';
import simpleShadow from '@/shadow/simpleShadow.jpg';

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

  // add textureLoader
  const textureLoader = new THREE.TextureLoader();
  const bakedShadowTexture = textureLoader.load(bakedShadow);
  const simpleShadowTexture = textureLoader.load(simpleShadow);

  //const material = new THREE.MeshStandardMaterial();
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: '#eee',
  });

  // add a plane
  const plane = new THREE.PlaneGeometry(6, 6);
  const planeMaterial = new THREE.MeshBasicMaterial();
  // use baked shadow
  /* new THREE.MeshBasicMaterial({
    map: bakedShadowTexture,
  }); */
  const planeMesh = new THREE.Mesh(plane, planeMaterial);
  planeMesh.position.y = -0.5;
  planeMesh.rotation.x = -Math.PI / 2;
  planeMesh.rotation.z = Math.PI * 0.2;

  // add a sphere
  const sphere = new THREE.SphereGeometry(0.5, 32, 32);
  const shpereMesh = new THREE.Mesh(sphere, sphereMaterial);
  // shpereMesh.position.y = 0.5;

  // add sphere shadow
  const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      color: '#000',
      transparent: true,
      alphaMap: simpleShadowTexture,
    })
  );
  sphereShadow.rotation.x = -Math.PI / 2;
  sphereShadow.position.y = planeMesh.position.y + 0.001;

  /* shpereMesh.castShadow = true;
  planeMesh.receiveShadow = true; */

  scene.add(shpereMesh, planeMesh, sphereShadow);

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

  const clock = new THREE.Clock();
  // 添加球体/阴影运动动画
  const animationFunction = () => {
    const elapsedTime = clock.getElapsedTime();
    const sphereY = (shpereMesh.position.y = Math.abs(
      Math.sin(elapsedTime * 2) * 1.5
    ));
    shpereMesh.position.x = Math.cos(elapsedTime);
    shpereMesh.position.z = Math.sin(elapsedTime);

    sphereShadow.position.x = shpereMesh.position.x;
    sphereShadow.position.z = shpereMesh.position.z;
    sphereShadow.material.opacity = 1 - sphereY;
  };

  const tick = () => {
    control.update();
    animationFunction();
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
