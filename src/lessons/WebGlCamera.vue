<script setup>
import * as THREE from "three";
import { onMounted, ref, watch } from "vue";
import Stats from "three/examples/jsm/libs/stats.module.js";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const aspect = screenWidth / screenHeight;
const webglDom = ref();

let camera, scene, renderer;
// 透视相机
let cameraPerspective, cameraPerspectiveHelper;
// 正交相机
let cameraOrtho, cameraOrthoHelper;
let cameraRig,
  activeCamera = ref(),
  activeHelper;
let mesh, mesh2;
let stats;

const frustumSize = 600;

const init = () => {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
  camera.position.z = 2500;

  cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);
  cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
  scene.add(cameraPerspective, cameraPerspectiveHelper);

  cameraOrtho = new THREE.OrthographicCamera(
    (0.5 * frustumSize * aspect) / -2,
    (0.5 * frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    150,
    1000,
  );
  cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
  cameraOrthoHelper.visible = false;
  scene.add(cameraOrthoHelper);

  activeCamera.value = cameraPerspective;
  activeHelper = cameraPerspectiveHelper;

  cameraPerspective.rotation.y = Math.PI;
  cameraOrtho.rotation.y = Math.PI;

  cameraRig = new THREE.Group();
  cameraRig.add(cameraPerspective, cameraOrtho);
  scene.add(cameraRig);

  mesh = new THREE.Mesh(
    new THREE.SphereGeometry(100, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
  );
  scene.add(mesh);
  mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(50, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
  );
  mesh2.position.y = 150;
  mesh.add(mesh2);

  const mesh3 = new THREE.Mesh(
    new THREE.SphereGeometry(5, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
  );
  mesh3.position.z = 150;
  cameraRig.add(mesh3);

  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0x888888 }),
  );
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(screenWidth, screenHeight);
  renderer.setAnimationLoop(animateFn);
  // 是否设置剪裁测试
  renderer.setScissorTest(true);

  webglDom.value.appendChild(renderer.domElement);

  // 监控帧率的工具
  stats = new Stats();
  webglDom.value.appendChild(stats.dom);
};

const animateFn = () => {
  render();
  stats.update();
};

const render = () => {
  const r = Date.now() * 0.0005;

  mesh.position.x = 700 * Math.cos(r);
  mesh.position.z = 700 * Math.sin(r);
  mesh.position.y = 700 * Math.sin(r);

  mesh.children[0].position.x = 70 * Math.cos(2 * r);
  mesh.children[0].position.z = 70 * Math.sin(r);

  if (activeCamera === cameraPerspective) {
    cameraOrthoHelper.visible = false;
  } else {
    cameraPerspectiveHelper.visible = false;
  }

  cameraRig.lookAt(mesh.position);

  activeHelper.visible = true;

  renderer.setClearColor(0x000000, 1);
  // 设置剪裁的区域，x,y,width,height。(x, y)位于剪裁区域的左下角（low-left corner)
  renderer.setScissor(0, 0, screenWidth / 2, screenHeight);
  // 设置视口，x,y,width,height。(x, y)位于视口的左下角（low-left corner)
  renderer.setViewport(0, 0, screenWidth / 2, screenHeight);
  renderer.render(scene, camera);

  //

  activeHelper.visible = false;

  renderer.setClearColor(0x111111, 1);
  renderer.setScissor(screenWidth / 2, 0, screenWidth / 2, screenHeight);
  renderer.setViewport(screenWidth / 2, 0, screenWidth / 2, screenHeight);
  renderer.render(scene, activeCamera.value);
};

const onKeyDownHandle = (event) => {
  switch (event.keyCode) {
    // o
    case 79:
      activeCamera.value = cameraOrtho;
      activeHelper = cameraOrthoHelper;
      break;
    // p
    case 80:
      activeCamera.value = cameraPerspective;
      activeHelper = cameraPerspectiveHelper;
      break;
  }
};

onMounted(() => {
  init();
});
</script>

<template>
  <div @keydown="onKeyDownHandle" tabindex="-1">
    <div class="webgl" ref="webglDom"></div>
  </div>
</template>

<style scoped>
.webgl {
  width: 100%;
  height: 100%;
}
</style>
