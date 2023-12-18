import * as THREE from 'three';
import { GameRoom, StartRoom } from '../app';
import * as utils from '../utils';
import * as levels from '../levels';

class App {
	constructor() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		this.gameRoom = new GameRoom();
		this.startRoom = new StartRoom();

		this.gameRoomName = "No Room";
		this.targetRoomName = "Tutorial_hard3";
		this.all_game_rooms = []
		this.all_game_rooms.push(levels.Levels["Tutorial"])
		this.level = -1;
		this.second_level = -1;

		this.audio_listener = new THREE.AudioListener();
	}
	run() {
		utils.KeyboardUpdate();
		if (this.second_level == -2) {
			// get back from second level to first level
			this.level = -1;
			this.second_level = -1;
			this.startRoom.reset();
			this.startRoom.reset_second_blocks();
		}
		if (this.level == -1) {
			this.level = this.startRoom.Step(); // -1 for start, 0 for level 0, 1 for level 1, etc.
			// TODO: get this.targetRoomName from this.level

			this.renderer.render(this.startRoom.scene, this.startRoom.camera);
		}
		else if (this.second_level == -1) {
			this.second_level = this.startRoom.SecondStep();
			if (this.second_level != -1) {
				this.startRoom.current_second_level = 0;
				this.targetRoomName = this.all_game_rooms[this.level][this.second_level];
			}
			this.renderer.render(this.startRoom.scene, this.startRoom.camera);
		}
		else {
			let keyboardValue = utils.getKeyboardValue();
			if (keyboardValue.PausePressed) {  // Yeah...now the pause key is actually the back key.
				this.level = -1;
				this.second_level = -1;
				this.startRoom.reset();
				this.gameRoomName = "No Room";
				this.targetRoomName = "No Room";
				utils.play_music("Intro");
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
};

export default App;