<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";

const webglDom = ref();

let scene, renderer, camera;
let mesh;
let amount = 6;
const AMOUNT = 6;
const axisHelper = new THREE.AxesHelper();

function init() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  const cameras = [];
  const subWidth = (window.innerWidth / amount) * window.devicePixelRatio;
  const subHeight = (window.innerHeight / amount) * window.devicePixelRatio;

  scene = new THREE.Scene();

  for (let y = 0; y < amount; y++) {
    for (let x = 0; x < amount; x++) {
      const subcamera = new THREE.PerspectiveCamera(40, aspectRatio, 0.1, 10);
      subcamera.viewport = new THREE.Vector4(
        Math.floor(x * subWidth),
        Math.floor(y * subHeight),
        Math.ceil(subWidth),
        Math.ceil(subHeight),
      );
      subcamera.position.x = x / amount - 0.5;
      subcamera.position.y = 0.5 - y / amount;
      subcamera.position.z = 1.5;
      // 向量乘系数x
      subcamera.position.multiplyScalar(2);
      subcamera.lookAt(0, 0, 0);
      // 对于更新过rotation/position/scale之类的都会自动更新矩阵。相关文档：https://threejs.org/docs/index.html#manual/en/introduction/Matrix-transformations
      subcamera.updateMatrixWorld();
      cameras.push(subcamera);
    }
  }

  camera = new THREE.ArrayCamera(cameras);
  camera.position.z = 3;

  scene.add(new THREE.AmbientLight(0x999999));
  scene.add(axisHelper);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0.5, 0.5, 1);
  light.castShadow = true;
  light.shadow.camera.zoom = 6;
  scene.add(light);

  scene.add(new THREE.CameraHelper(light.shadow.camera));

  // 添加背景
  const backgroundGeometry = new THREE.PlaneGeometry(100, 100);
  const backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x000066 });
  const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  backgroundMesh.receiveShadow = true;
  backgroundMesh.position.set(0, 0, -1);
  scene.add(backgroundMesh);

  // 添加几何体
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
  const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  // renderer.render(scene, camera);
  // 如果在render后调用就不会生效
  renderer.shadowMap.enabled = true;

  webglDom.value.appendChild(renderer.domElement);
}

function animate() {
  mesh.rotation.x += 0.005;
  mesh.rotation.z += 0.01;
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
});
</script>

<template>
  <div class="webgl" ref="webglDom"></div>
</template>

<style scoped>
.webgl {
  width: 100%;
  height: 100%;
}
</style>
