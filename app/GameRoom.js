import * as THREE from 'three';
import * as utils from '../utils';
import * as game_objects from '../objects';

class GameRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.paused = false;
		this.room_height = 0;
		this.room_width = 0;
	}
	init_debug() {
		this.player = new game_objects.Player(this, new THREE.Vector2(0, 20));
		this.blocks = [];
		this.spikes = [];
		this.special_objects = [];

		// add blocks
		this.blocks.push(new game_objects.Block(this, new THREE.Vector2(-10, 0), 26, 20));
		// this.blocks.push(new game_objects.Block(this, new THREE.Vector2(16, 0), 16, 50));
		this.blocks.push(new game_objects.Block(this, new THREE.Vector2(-26, 0), 16, 50));

		// add lights
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.x = 10;
		directionalLight.position.y = 100;
		directionalLight.position.z = 20;
		this.scene.add(directionalLight);

		const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambientlight);

		this.camera.position.x = 10;
		this.camera.position.y = 50;
		this.camera.position.z = 100;

		this.reset();
	}
	load_room(room_file) {
		// this.player = new game_objects.Player();
		// these two are special.
		this.blocks = [];
		this.spikes = [];
		// TODO: add other objects;
		this.special_objects = [];
		// TODO: load room.

		this.reset();
	}
	reset() {
		this.player.reset();
		for (var block of this.blocks) {
			block.reset();
		}
		for (var spike of this.spikes) {
			spike.reset();
		}
		for (var obj of this.special_objects) {
			obj.reset();
		}
		// TODO: reset camera position.

		this.paused = false;
		this.wins = false;
	}
	// Given the time elapsed and keyboard inputs, compute the next state.
	Step() {
		var keyboardValue = utils.getKeyboardValue();
		if (keyboardValue.ResetPressed) {
			this.reset();
		}
		if (!this.paused) {
			if (this.wins) {
				// TODO
				return;
			}
			else if (this.player.should_be_killed) {
				// TODO (may be nothing to do here)
				return;
			}
			if (keyboardValue.PausePressed) {
				this.paused = true;
				return;
			}
			for (var block of this.blocks) {
				block.onStep();
			}
			for (var spike of this.spikes) {
				spike.onStep();
			}
			for (var obj of this.special_objects) {
				obj.onStep();
			}
			this.player.onStep();
		}
		else {
			// TODO
			// window.alert("Paused");
			if (keyboardValue.PausePressed) {
				this.paused = false;
				return;
			}
		}
	}
	// Compute the poses of objects, and then render the image.
	Render() {
		for (var block of this.blocks) {
			block.onRender();
		}
		for (var spike of this.spikes) {
			spike.onRender();
		}
		for (var obj of this.special_objects) {
			obj.onRender();
		}
		this.player.onRender();
	}
}

export default GameRoom;
