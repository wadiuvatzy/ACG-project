import * as THREE from 'three';
import { GameRoom, StartRoom } from 'app';

class App {
	constructor() {
		self.renderer = new THREE.WebGLRenderer({ antialias: true });
		self.renderer.setSize(window.innerWidth, window.innerHeight);
		self.clock = new THREE.Clock(true);

		self.gameRoom = new GameRoom();
		self.startRoom = new StartRoom();
	}
	run() {

	}
}