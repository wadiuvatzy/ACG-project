import * as THREE from 'three';
import * as utils from 'utils';
import * as game_objects from 'objects';

class GameRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera();
		this.paused = false;
		this.room_height = 0;
		this.room_width = 0;
	}
	load_room(room_file) {
		this.player = new game_objects.Player();
		// these two are special.
		this.blocks = [];
		this.spikes = [];
		// TODO: add other objects;
		this.special_objects = []
		// TODO: load room.

	}
	reset() {
		this.player.reset();
		for (block in this.blocks) {
			block.reset();
		}
		for (spike in this.spikes) {
			spike.reset();
		}
		for (obj in this.special_objects) {
			obj.reset();
		}
		this.paused = false;
	}
	// Given the time elapsed and keyboard inputs, compute the next state.
	Step() {
		var keyboardValue = utils.getKeyboardValue();
		if (!paused) {
			for (block in this.blocks) {
				block.onStep();
			}
			for (spike in this.spikes) {
				spike.onStep();
			}
			for (obj in this.special_objects) {
				obj.onStep();
			}
			player.onStep();
		}
		else {
			// TODO
		}
	}
	// Compute the poses of objects, and then render the image.
	Render(renderer) {
		if (!paused) {
			for (block in this.blocks) {
				block.onRender();
			}
			for (spike in this.spikes) {
				spike.onRender();
			}
			for (obj in this.special_objects) {
				obj.onRender();
			}
			player.onRender();
		}
		else {
			// TODO
		}
		renderer.render(this.scene, this.camera);
	}
}
