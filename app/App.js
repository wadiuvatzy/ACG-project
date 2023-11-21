import * as THREE from 'three';
import { GameRoom, StartRoom } from '../app';
import * as utils from '../utils';

class App {
	constructor() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		// this.clock = new THREE.Clock(true);

		this.gameRoom = new GameRoom();
		this.startRoom = new StartRoom();

		// TODO: load the start room;
		this.gameRoomName = "No Room";
		this.targetRoomName = "Debug";
	}
	run_debug() {
		utils.KeyboardUpdate();

		// if (this.gameRoomName != this.targetRoomName) {
		// 	this.gameRoomName = this.targetRoomName;
		// 	this.gameRoom.init_debug();
		// }
		// this.gameRoom.Step();
		// this.gameRoom.Render();

		// this.renderer.render(this.gameRoom.scene, this.gameRoom.camera);
		this.startRoom.Step();
		this.renderer.render(this.startRoom.scene, this.startRoom.camera);
	}
	run() {

	}
};

export default App;