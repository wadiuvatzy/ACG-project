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
		// this.player = new game_objects.Player();
		this.blocks = [];
		this.spikes = [];
		this.special_objects = [];

		// add blocks
		this.blocks.push(new game_objects.Block(this, new THREE.Vector2(0, 0), 16, 20));

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

	}
	reset() {
		// this.player.reset();
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
	}
	// Given the time elapsed and keyboard inputs, compute the next state.
	Step() {
		var keyboardValue = utils.getKeyboardValue();
		if (!paused) {
			for (var block of this.blocks) {
				block.onStep();
			}
			for (var spike of this.spikes) {
				spike.onStep();
			}
			for (var obj of this.special_objects) {
				obj.onStep();
			}
			// player.onStep();
		}
		else {
			// TODO
		}
	}
	// Compute the poses of objects, and then render the image.
	Render() {
		if (!this.paused) {
			for (var block of this.blocks) {
				block.onRender();
			}
			for (var spike of this.spikes) {
				spike.onRender();
			}
			for (var obj of this.special_objects) {
				obj.onRender();
			}
			// player.onRender();
		}
		else {
			// TODO
		}
	}
}

export default GameRoom;
