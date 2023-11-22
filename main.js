import * as THREE from 'three';

import { App } from './app';
import * as utils from './utils'

const FPS = 60;
var now;
var then = Date.now();
var interval = 1000 / FPS;
var delta;

utils.InitKeyboard();
const app = new App();

function animate() {
	requestAnimationFrame(animate);
	now = Date.now();
	delta = now - then;
	if (delta >= interval) {
		then = now - (delta % interval);
		app.run_debug();
	}
}

animate();


/*
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

animate();
*/