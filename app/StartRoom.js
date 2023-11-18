import * as THREE from 'three';

class GameRoom {
	constructor() {
		self.scene = new THREE.Scene();
		self.camera = new THREE.PerspectiveCamera();
	}
	reset() {

	}
	Step() {

	}
	Render(renderer) {
		renderer.render(self.scene, self.camera);
	}
}