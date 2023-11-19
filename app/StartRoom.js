import * as THREE from 'three';

class StartRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	}
	reset() {

	}
	Step() {

	}
	Render() {

	}
}

export default StartRoom;