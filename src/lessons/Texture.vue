<script setup>
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import { onMounted } from "vue";
import doorColor from "../assets/color.jpg";
import normalColor from "../assets/normal.jpg";
import boxTexture from "../assets/checkerboard-1024x1024.png";
import boxTexture_s from "../assets/checkerboard-8x8.png";

defineProps({
  msg: String,
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

onMounted(() => {
  /**
   * get the dom
   */
  const canvas = document.querySelector(".three-container");

  /**
   * create scene
   */
  const scene = new THREE.Scene();

  /**
   * create camera
   */
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );

  camera.position.set(1, 1, 1);
  scene.add(camera);

  /**
   * create renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;

  /**
   * update when resize the window
   */
  window.addEventListener("resize", () => {
    // update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // 更新renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * create a Image
   */
  const image = new Image();
  const loadingManager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(loadingManager);

  const colorTexture = textureLoader.load(doorColor);
  const normalTexture = textureLoader.load(boxTexture_s);

  loadingManager.onStart = () => {
    console.log("start loading");
  };

  loadingManager.onLoad = () => {
    console.log("loading complete");
  };

  loadingManager.onProgress = () => {
    console.log("loading progressing");
  };

  loadingManager.onError = () => {
    console.log("loading error");
  };
  /* normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.x = 2;
  normalTexture.repeat.y = 2; */
  //normalTexture.flipY = false;

  /* normalTexture.offset.x = 0.3;
  normalTexture.offset.y = 0.3; */
  // normalTexture.rotation = Math.PI / 4;
  normalTexture.colorSpace = THREE.SRGBColorSpace; // to fixed texture looks greyish
  // add filter
  /**
   * mipmapping
   * what is mipmapping? is a rendering teqnique that can devide texture into smaller and smaller size until 1x1 size.
   * when mipmapping is enabled(by defualt), the GPU will use the different size versions of the texture depending how far it is from the camera.
   */

  /**
   * the minification filter defined the texture minification function to be used while the texture is too big for the surface.
   */
  // normalTexture.minFilter = THREE.NearestFilter;

  normalTexture.magFilter = THREE.NearestFilter;

  /**
   * create objects
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: normalTexture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const tick = () => {
    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();
});
</script>

<template>
  <canvas class="three-container"></canvas>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
