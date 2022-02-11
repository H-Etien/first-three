import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio); //definition du pixel
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30); //camera position
camera.position.setX(180);

renderer.render(scene, camera);
//render in browser

/************************************************************************** */
// création du mesh
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff6347,
//   wireframe: true,
// });
const material = new THREE.MeshStandardMaterial({
  color: 0x579bf4,
});
const torus = new THREE.Mesh(geometry, material);
const torus2 = new THREE.Mesh(geometry, material);

/******************************* */
// texture / earth
const moonTexture = new THREE.TextureLoader().load("./texture/moon.jpg");
const moonNormalTexture = new THREE.TextureLoader().load(
  "./texture/normal.jpg"
);

const moonGeo = new THREE.SphereGeometry(5, 20, 20);
const moonMat = new THREE.MeshBasicMaterial({
  map: moonTexture,
  normalMap: moonNormalTexture,
});

const moon = new THREE.Mesh(moonGeo, moonMat);
const moon2 = new THREE.Mesh(moonGeo, moonMat);

/***************************** */
//Moon
// const moonGeo = new THREE.SphereGeometry(5, 10, 10);
// const moonMat = new THREE.MeshStandardMaterial({
//   color: 0x6b41f5,
// });
// const moon = new THREE.Mesh(moonGeo, moonMat);
// const moon2 = new THREE.Mesh(moonGeo, moonMat);

// mesh to scene
// scene.add(torus);

// source lumière
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

/************************************ */
// Helper
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);
/********************************** */
// orbit control
const controls = new OrbitControls(camera, renderer.domElement);

/********************************** */

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);
// for (let i = 0; i < 100; i++) {
//   addStar();
// }

/********************************************* */
// donut
let donut;
let donut2;

let Loader = new GLTFLoader();
Loader.load("./mesh/donut6.gltf", (gltf) => {
  donut = gltf.scene;

  donut.position.x = 25;

  donut.rotateX(80);
  // donut.rotateY(140);
  pivotTorus.add(donut);
});

let Loader2 = new GLTFLoader();
Loader2.load("./mesh/donut6.gltf", (gltf) => {
  donut2 = gltf.scene;

  donut2.position.x = -25;

  donut2.rotateX(80);
  // donut.rotateY(140);
  pivotTorus.add(donut2);
});

/******************************************** */
// background
const spaceTexture = new THREE.TextureLoader().load("space.jfif");
scene.background = spaceTexture;

/************************************* */
// pivot point
const pivotGeo = new THREE.SphereGeometry(0, 10, 10);
const pivotMat = new THREE.MeshStandardMaterial({ color: 0xf00000 });
const pivotTorus = new THREE.Mesh(pivotGeo, pivotMat);
const pivotMoon = new THREE.Mesh(pivotGeo, pivotMat);

pivotTorus.position.x = 50;
pivotMoon.position.x = 50;

scene.add(pivotTorus);
scene.add(pivotMoon);

/*************************************** */
// position
torus.position.x = 25;
torus2.position.x = -25;

moon.position.x = 25;
moon2.position.x = -25;

pivotTorus.add(torus);
pivotTorus.add(torus2);
pivotMoon.add(moon);
pivotMoon.add(moon2);

/************************* */
// scroll camera
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.x = t * -0.06 + 40;
  camera.position.z = t * 0.6 + 80;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.005;
  torus2.rotation.x += 0.005;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  pivotTorus.rotation.x += 0.01;
  pivotTorus.rotation.y += 0.01;
  // pivotTorus.rotation.z += 0.005;

  pivotMoon.rotation.x += -0.005;
  pivotMoon.rotation.y += -0.005;
  // pivotMoon.rotation.z += -0.005;

  donut.rotation.x += 0.005;
  donut2.rotation.x += 0.005;

  controls.update();

  renderer.render(scene, camera);
}

animate();
