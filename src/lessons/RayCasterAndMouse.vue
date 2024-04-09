<template>
  <canvas class="webgl"></canvas>
</template>
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { onMounted } from 'vue';
import { Raycaster } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const initFunction = () => {
  /**
   * Base
   */
  // Debug
  const gui = new GUI();

  // Canvas
  const canvas = document.querySelector('canvas.webgl');

  // Scene
  const scene = new THREE.Scene();

  const gltfLoader = new GLTFLoader();
  let model = null;
  gltfLoader.load('/src/assets/models/Duck/glTF/Duck.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);
  });

  /**
   * Objects
   */
  const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  );
  object1.position.x = -2;

  const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  );

  const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
  );
  object3.position.x = 2;

  scene.add(object1, object2, object3);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
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

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 3;
  scene.add(camera);

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Mouse
   */
  const mouse = new THREE.Vector2();

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  });

  /**
   * raycaster
   */
  let currentSelect = null;
  const raycaster = new Raycaster();

  const castRay = () => {
    if (!model) return;
    raycaster.setFromCamera(mouse, camera);
    // const objectToTest = [object1, object2, object3];
    let intersections = null;

    intersections = raycaster.intersectObject(model);
    /* objectToTest.forEach((item) => {
      if (!intersections.find((intersection) => item === intersection.object)) {
        item.material.color.set('red');
      }
    }); */

    if (!intersections.length && currentSelect) {
      currentSelect.scale.set(1, 1, 1);
      currentSelect = null;
      console.log('mouseleave');
    }

    if (intersections.length && currentSelect !== intersections[0].object) {
      currentSelect = intersections[0].object;
      console.log('mouseenter');
      currentSelect.scale.set(1.5, 1.5, 1.5);
    }

    /* intersections.forEach((intersect) => {
      intersect.object.material.color.set('#0000ff');
    }); */
  };

  window.addEventListener('click', () => {
    if (currentSelect) {
      switch (currentSelect) {
        case object1:
          console.log('click on object 1');
          break;

        case object2:
          console.log('click on object 2');
          break;

        case object3:
          console.log('click on object 3');
          break;
      }
    }
  });

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime * 3) * 0.5;
    object2.position.y = Math.sin(elapsedTime * 2) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.5) * 2.5;

    castRay();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};

onMounted(() => {
  initFunction();
});
</script>
<style scoped></style>
