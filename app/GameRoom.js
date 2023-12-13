import * as THREE from 'three';
import * as utils from '../utils';
import * as game_objects from '../objects';
import * as levels from '../levels';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


class CameraTrigger {
	constructor(left, right, low, high, border_left, border_right, border_low, border_high, z = 150, xy_gamma = 0.05, z_velocity = 2.0, player_offset_x = 0.0, player_offset_y = 0.0) {
		this.left = left;
		this.right = right;
		this.low = low;
		this.high = high;
		this.border_left = border_left;
		this.border_right = border_right;
		this.border_low = border_low;
		this.border_high = border_high;
		this.z = z;
		this.gamma = xy_gamma;
		this.z_velocity = z_velocity;
		this.player_offset_x = player_offset_x;
		this.player_offset_y = player_offset_y;
	}
	be_triggered(player_position) {
		return this.left < player_position.x && player_position.x < this.right && this.low < player_position.y && player_position.y < this.high;
	}
	get_target_position(player_position) {
		var target_position = new THREE.Vector3();
		target_position.x = Math.max(this.border_left, Math.min(this.border_right, player_position.x + this.player_offset_x));
		target_position.y = Math.max(this.border_low, Math.min(this.border_high, player_position.y + this.player_offset_y));
		target_position.z = this.z;
		return target_position;
	}
	move_to_target_position(player_position, camera_position) {
		var target_position = new THREE.Vector3();
		if (camera_position.z < this.z)
			target_position.z = Math.min(this.z, camera_position.z + this.z_velocity);
		else if (camera_position.z > this.z)
			target_position.z = Math.max(this.z, camera_position.z - this.z_velocity);
		else
			target_position.z = this.z;
		target_position.x = camera_position.x * (1 - this.gamma) + this.gamma * Math.max(this.border_left, Math.min(this.border_right, player_position.x + this.player_offset_x));
		target_position.y = camera_position.y * (1 - this.gamma) + this.gamma * Math.max(this.border_low, Math.min(this.border_high, player_position.y + this.player_offset_y));
		return target_position;
	}
}


class CameraController {
	constructor(gameRoom) {
		this.gameRoom = gameRoom;
		this.triggers = []
		this.triggers.push(new CameraTrigger(-100, -100, -100, -100, -10000, 10000, 32, 64));
		this.current_trigger = this.triggers[0];
	}
	reset() {
		this.current_trigger = this.triggers[0];
		let target_position = this.current_trigger.get_target_position(this.gameRoom.player.position);
		this.gameRoom.camera.position.x = target_position.x;
		this.gameRoom.camera.position.y = target_position.y;
		this.gameRoom.camera.position.z = target_position.z;
	}
	onStep() {
		for (const trigger of this.triggers)
			if (trigger.be_triggered(this.gameRoom.player.position))
				this.current_trigger = trigger;
		let target_position = this.current_trigger.move_to_target_position(this.gameRoom.player.position, this.gameRoom.camera.position);
		this.gameRoom.camera.position.x = target_position.x;
		this.gameRoom.camera.position.y = target_position.y;
		this.gameRoom.camera.position.z = target_position.z;
	}
}


class GameRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.paused = false;
		this.player = null;
		this.blocks = [];
		this.spikes = [];
		this.special_objects = [];
		this.dead_waiting_reset = false;
		this.just_dead = false;
		this.camera_controller = new CameraController(this);
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
	init_room(room_name) {
		this.scene = new THREE.Scene();
		levels.make_level(this, levels.NameToLevel[room_name]);

		// add lights
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		this.directionalLight.position.x = 10;
		this.directionalLight.position.y = 100;
		this.directionalLight.position.z = 20;
		this.scene.add(this.directionalLight);

		const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambientlight);

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
		this.camera_controller.reset();

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
		this.scene.remove(this.quit_text);
	}
	// Given the time elapsed and keyboard inputs, compute the next state.
	Step() {
		var keyboardValue = utils.getKeyboardValue();
		if (keyboardValue.ResetPressed) {
			this.reset();
		}
		if (this.wins) {
			this.paused = true;
			// TODO
			return;
		}
		if (this.player.should_be_killed) {
			this.paused = true;
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

		// camera control
		this.camera_controller.onStep();
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

			var texture = new THREE.TextureLoader().load("../textures/Rreset.png");
			var geometry = new THREE.PlaneGeometry(123.5, 23);
			var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
			this.reset_text = new THREE.Mesh(geometry, material);
			this.reset_text.position.x = this.camera.position.x;
			this.reset_text.position.y = this.camera.position.y + 20;
			this.reset_text.position.z = this.camera.position.z / 2;
			this.scene.add(this.reset_text);

			var texture = new THREE.TextureLoader().load("../textures/ESCquit.png");
			var geometry = new THREE.PlaneGeometry(123.5, 23);
			var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.5 });
			this.quit_text = new THREE.Mesh(geometry, material);
			this.quit_text.position.x = this.camera.position.x;
			this.quit_text.position.y = this.camera.position.y - 20;
			this.quit_text.position.z = this.camera.position.z / 2;
			this.scene.add(this.quit_text);
		}
	}
}

export { GameRoom, CameraTrigger };
