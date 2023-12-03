import * as THREE from 'three';
import * as utils from '../utils';
import * as game_objects from '../objects';
import * as levels from '../levels';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class GameRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.paused = false;
		this.room_height = 0;
		this.room_width = 0;
		this.player = null;
		this.blocks = [];
		this.spikes = [];
		this.special_objects = [];
		this.dead_waiting_reset = false;
		this.just_dead = false;
	}
	init_debug() {
		/*
		this.player = new game_objects.Player(this, new THREE.Vector2(0, 20));
		this.blocks = [];
		this.spikes = [];
		this.special_objects = [];

		// add blocks
		this.blocks.push(new game_objects.Block(this, new THREE.Vector2(-10, 0), 86, 20));
		// this.blocks.push(new game_objects.Block(this, new THREE.Vector2(16, 0), 16, 50));
		this.blocks.push(new game_objects.Block(this, new THREE.Vector2(-26, 0), 16, 50));
		this.blocks.push(new game_objects.DropBlock(this, new THREE.Vector2(40, 30), 8, 8));
		this.blocks.push(new game_objects.WeakBlock(this, new THREE.Vector2(30, 20), 24, 8));

		// add spikes
		this.spikes.push(new game_objects.Spike(this, new THREE.Vector2(-10, 40), null));
		this.spikes.push(new game_objects.Spike(this, new THREE.Vector2(40, 30), this.blocks[2]));
		*/

		levels.make_level(this, levels.NameToLevel["Tutorial_easy1"]);

		// add lights
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		this.directionalLight.position.x = 10;
		this.directionalLight.position.y = 100;
		this.directionalLight.position.z = 20;
		this.scene.add(this.directionalLight);

		const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambientlight);

		this.camera.position.x = 100;
		this.camera.position.y = 64;
		this.camera.position.z = 200;
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
		this.dead_waiting_reset = false;

		this.scene.remove(this.directionalLight)
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		this.directionalLight.position.x = 10;
		this.directionalLight.position.y = 100;
		this.directionalLight.position.z = 20;
		this.scene.add(this.directionalLight);
		this.scene.remove(this.reset_text);

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
				if (this.dead_waiting_reset) {
					this.just_dead = false;
					this.dead_waiting_reset = true;
				}
				else {
					this.just_dead = true;
					this.dead_waiting_reset = true;
				}
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
		if (this.just_dead) {
			this.scene.remove(this.directionalLight)
			// window.alert("scene: ", this.scene)
			this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
			this.directionalLight.position.x = 10;
			this.directionalLight.position.y = 100;
			this.directionalLight.position.z = 20;
			this.scene.add(this.directionalLight);

			// add text to tell player to press R to reset
			this.scene.remove(this.reset_text);
			const loader = new FontLoader();
			loader.load('../fonts/helvetiker_regular.typeface.json', function (font) {
				var geometry = new TextGeometry("Press R to reset", {
					font: font,
					size: 12,
					height: 1,
					bevelEnabled: true,
					bevelThickness: 0.5,
					bevelSize: 0.3,
					bevelSegments: 0.5
				});
				geometry.computeBoundingBox();
				geometry.center();
				var material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
				material.emissive = new THREE.Color(0x00ffff);
				material.emissiveIntensity = 0.5;
				this.reset_text = new THREE.Mesh(geometry, material);
				this.reset_text.position.x = this.camera.position.x;
				this.reset_text.position.y = this.camera.position.y;
				this.reset_text.position.z = this.camera.position.z - 100;
				this.scene.add(this.reset_text);
			}.bind(this));

		}
	}
}

export default GameRoom;
