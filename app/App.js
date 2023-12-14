import * as THREE from 'three';
import { GameRoom, StartRoom } from '../app';
import * as utils from '../utils';

class App {
	constructor() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		this.gameRoom = new GameRoom();
		this.startRoom = new StartRoom();

		this.gameRoomName = "No Room";
		this.targetRoomName = "Tutorial_hard2";
		this.level = -1;
	}
	run_debug() {
		utils.KeyboardUpdate();

		if (this.level == -1) {
			this.level = this.startRoom.Step(); // -1 for start, 0 for level 0, 1 for level 1, etc.
			// TODO: get this.targetRoomName from this.level

			this.renderer.render(this.startRoom.scene, this.startRoom.camera);
		}
		else {
			let keyboardValue = utils.getKeyboardValue();
			if (keyboardValue.PausePressed) {  // Yeah...now the pause key is actually the back key.
				this.level = -1;
				this.gameRoomName = "No Room";
			}
			if (this.gameRoomName != this.targetRoomName) {
				this.gameRoomName = this.targetRoomName;
				this.gameRoom.init_room(this.gameRoomName);
			}
			this.gameRoom.Step();
			this.gameRoom.Render();
			this.renderer.render(this.gameRoom.scene, this.gameRoom.camera);
		}
	}
	run() {

	}
};

export default App;