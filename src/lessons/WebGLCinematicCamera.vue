<script setup>
import * as THREE from "three";
import { CinematicCamera } from "three/examples/jsm/Addons.js";
import { onMounted, ref } from "vue";

let scene = new THREE.Scene(),
  renderer,
  camera,
  raycaster = new THREE.Raycaster();
let width, height;
let pointer = new THREE.Vector2();
const webglDom = ref();
let intersected, currentEmissive;
let theta = 0,
  radius = 100;
let mouseleaved = false;

const animate = () => {
  theta += 0.1;

  camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));

  camera.lookAt(scene.position);
  camera.updateMatrixWorld();
  const intersections = raycaster.intersectObjects(scene.children, false);

  if (!mouseleaved) {
    raycaster.setFromCamera(pointer, camera);

    if (intersections.length > 0) {
      if (intersected !== intersections[0].object) {
        if (intersected) {
          intersected.material.emissive.setHex(currentEmissive);
        }
        intersected = intersections[0].object;
        currentEmissive = intersected.material.emissive.getHex();
        intersected.material.emissive.setHex(0xff0000);
      }
    }
  }

  if (intersected && (intersections.length === 0 || mouseleaved)) {
    intersected.material.emissive.setHex(currentEmissive);
    intersected = null;
  }

  renderer.clear();
  renderer.render(scene, camera);
};

function init() {
  width = window.innerWidth;
  height = window.innerHeight;

  // 设置场景的背景颜色
  scene.background = new THREE.Color(0xf0f0f0);

  // 添加方向性光源
  const light = new THREE.DirectionalLight(0xffffff);
  // 光源位置为单位向量
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // 电影相机
  camera = new CinematicCamera(60, width / height, 1, 1000);
  camera.position.set(2, 1, 500);
  // focalLength: 焦距。（通过设置焦距来设置fov）
  // filmGauge: 电影胶片条的宽度
  // fNumber: 按照孔径计算的焦距
  // coc（Circle of Confusion）: 指由镜头形成的模糊图像中的不清晰的圆形区域，代表一个物体点的失焦图像
  camera.setLens(15, camera.frameHeight, 2.8, camera.coc);

  const geometry = new THREE.BoxGeometry(20, 20, 20);

  for (let i = 0; i < 1500; i++) {
    const object = new THREE.Mesh(
      geometry,
      // 一种没有光泽的材质，没有反射的高光
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
    );
    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    scene.add(object);
  }

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(animate);
  renderer.render(scene, camera);

  webglDom.value.appendChild(renderer.domElement);
}

const onMouseMoveHandle = (e) => {
  e.preventDefault();
  // 因为rayCaster的setFromCamera方法的第一个参数需要NDC坐标，屏幕坐标转换NDC坐标的公式如下所示
  pointer.set((e.clientX / width) * 2 - 1, 1 - (e.clientY / height) * 2);
};

const onMouseLeave = () => {
  mouseleaved = true;
};

const onMouseEnter = () => {
  mouseleaved = false;
};

onMounted(() => {
  init();
});
</script>

<template>
  <div
    class="webgl"
    ref="webglDom"
    @mousemove="onMouseMoveHandle"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
  ></div>
</template>

<style scoped></style>
