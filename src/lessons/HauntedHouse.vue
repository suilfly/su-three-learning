<template>
  <div class="haunted-house-wrapper"><canvas ref="canvasDom"></canvas></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted, ref } from 'vue';
import color from '@/textures/door/color.jpg';
import alpha from '@/textures/door/alpha.jpg';
import ambient from '@/textures/door/ambientOcclusion.jpg';
import height from '@/textures/door/height.jpg';
import normal from '@/textures/door/normal.jpg';
import metalness from '@/textures/door/metalness.jpg';
import roughness from '@/textures/door/roughness.jpg';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const canvasDom = ref<HTMLCanvasElement>();
const initFn = () => {
  const size = {
    width: canvasDom.value!.clientWidth,
    height: canvasDom.value!.clientHeight,
  };
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasDom.value,
  });
  renderer.setSize(size.width, size.height);

  const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  const control = new OrbitControls(camera, renderer.domElement);

  // init scene
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#a9c388',
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  scene.add(plane);

  // add Light
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight('#b9d5ff', 0.26);
  directionalLight.position.set(4, 5, -2);
  scene.add(directionalLight);

  // house container
  const house = new THREE.Group();
  scene.add(house);

  // walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e82' })
  );
  walls.position.y = 1.25;
  house.add(walls);

  // roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
  );
  roof.position.y = 2.5 + 0.5;
  roof.rotation.y = Math.PI / 4;
  house.add(roof);

  // door Texture
  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load(color);
  doorColorTexture.colorSpace = THREE.SRGBColorSpace;

  const doorAlphaTexture = textureLoader.load(alpha);
  const doorAmbientOcclusionTexture = textureLoader.load(ambient);
  const doorHeightTexture = textureLoader.load(height);
  const doorNormalTexture = textureLoader.load(normal);
  const doorMetalnessTexture = textureLoader.load(metalness);
  const doorRoughnessTexture = textureLoader.load(roughness);

  // door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      color: '#aa7b7b',
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );
  door.position.set(0, 1, 2.001);
  house.add(door);

  // door light
  const doorLight = new THREE.PointLight('#ff7d46', 3, 7);
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

  // fog
  const fog = new THREE.Fog('#262837', 1, 15);
  scene.fog = fog;
  renderer.setClearColor('#262837');

  //bushes
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.position.set(0.8, 0.2, 2.2);
  bush1.scale.set(0.5, 0.5, 0.5);
  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.position.set(1.4, 0.1, 2.2);
  bush2.scale.set(0.25, 0.25, 0.25);
  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.position.set(-0.8, 0.1, 2.2);
  bush3.scale.set(0.4, 0.4, 0.4);
  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.position.set(-1, 0.05, 2.6);
  bush4.scale.set(0.15, 0.15, 0.15);

  house.add(bush1, bush2, bush3, bush4);

  // graves
  const graves = new THREE.Group();
  scene.add(graves);

  const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

  for (let i = 0; i < 50; i++) {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * 6 + 3;
    const x = Math.cos(randomAngle) * randomRadius;
    const z = Math.sin(randomAngle) * randomRadius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);

    grave.position.set(x, 0.3, z);
    grave.castShadow = true;

    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    graves.add(grave);
  }

  // shadows
  renderer.shadowMap.enabled = true;
  plane.receiveShadow = true;
  directionalLight.castShadow = true;
  doorLight.castShadow = true;
  walls.castShadow = true;
  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ghosts
  const ghost1 = new THREE.PointLight('#ff00ff', 6, 3);
  scene.add(ghost1);

  const ghost2 = new THREE.PointLight('#00ffff', 6, 3);
  scene.add(ghost2);

  const ghost3 = new THREE.PointLight('#ffff00', 6, 3);
  scene.add(ghost3);

  const clock = new THREE.Clock();

  const tick = () => {
    renderer.render(scene, camera);
    control.update();

    const elapsedTime = clock.getElapsedTime();

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    requestAnimationFrame(tick);
  };

  tick();
};

onMounted(() => {
  initFn();
});
</script>

<style scoped>
.haunted-house-wrapper,
.haunted-house-wrapper canvas {
  width: 100%;
  height: 100%;
}
</style>
