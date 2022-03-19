import Stats from 'stats-js';
import { OrbitControls } from '@three-ts/orbit-controls';
import GUI from 'lil-gui';
import { getMandelBulb } from './mandelBulb';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const gui = new GUI();

// Add stats
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const resizeRendererToDisplaySize = (renderer: WebGLRenderer) => {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

// Scene
const scene = new Scene();

const params = {
  dim: 128,
  scale: 100,
  n: 16,
  maxIter: 20,
  color: 0xffffff,
  recalculate: null,
};
const recalculate = () => {
  scene.clear();
  scene.add(getMandelBulb(params));
};
params.recalculate = recalculate;
scene.add(getMandelBulb(params));

gui.add(params, 'dim', 16, 128, 16);
gui.add(params, 'scale', 10, 100, 1);
gui.add(params, 'n', 4, 64, 4);
gui.add(params, 'maxIter', 10, 20, 1);
gui.addColor(params, 'color');
gui.add(params, 'recalculate');

// Renderer
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
const ratio = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(45, ratio);
camera.position.set(0, 0, 500);
camera.lookAt(0, 0, 0);

// Orbit Controls The DOM element must now be given as a second argument
var controls = new OrbitControls(camera, renderer.domElement);

// loop
const animate = () => {
  requestAnimationFrame(animate);
  stats.begin();
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  controls.update();
  renderer.render(scene, camera);
  stats.end();
};

animate();
