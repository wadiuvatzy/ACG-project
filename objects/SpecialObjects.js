import { GameObject, GRAVITY, BLOCK_UNIT_SIZE } from '../objects';
import * as THREE from 'three';
import * as utils from '../utils';
import { DASH_DIRECTION_NONE, DIRECTION_LEFT, DIRECTION_RIGHT } from './Player';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'


class GameGoal extends GameObject {
	constructor(gameRoom, position) {
		super(gameRoom);
		this.position = position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.size = BLOCK_UNIT_SIZE;

		// initialize shape
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
		this.sphere = new THREE.Mesh(geometry, material);
		// this.gameRoom.scene.add(this.sphere);

		const gltfLoader = new GLTFLoader();
		const url = '../models3D/strawberry_from_celeste_voxel/scene.gltf';
		gltfLoader.load(url, (gltf) => {
			const root = gltf.scene;
			this.strawberry = root.children[0];
			let scale = 2;
			this.strawberry_offset_x = 45 / 2 * scale;
			this.strawberry_offset_y = 50 / 2 * scale;
			this.strawberry.scale.set(scale, scale, scale);
			this.gameRoom.scene.add(root);
		})

		this.iter = 0;
	}
	onStep() {
		this.iter += 0.5;
		if (this.iter >= 180)
			this.iter -= 180;
	}
	onRender() {
		this.sphere.position.x = this.position.x;
		this.sphere.position.y = this.position.y;
		this.sphere.position.z = 0;
		// window.alert([this.sphere.position.x, this.sphere.position.y, this.sphere.position.z]);
		let goal_color = 0;
		if (this.iter < 30) {
			goal_color = 0xff0000 + Math.floor(this.iter / 30 * 0xff) * 0x000100;
		}
		else if (this.iter < 60) {
			goal_color = 0x00ff00 + Math.floor((60 - this.iter) / 30 * 0xff) * 0x010000;
		}
		else if (this.iter < 90) {
			goal_color = 0x00ff00 + Math.floor((this.iter - 60) / 30 * 0xff) * 0x000001;
		}
		else if (this.iter < 120) {
			goal_color = 0x0000ff + Math.floor((120 - this.iter) / 30 * 0xff) * 0x000100;
		}
		else if (this.iter < 150) {
			goal_color = 0x0000ff + Math.floor((this.iter - 120) / 30 * 0xff) * 0x010000;
		}
		else {
			goal_color = 0xff0000 + Math.floor((180 - this.iter) / 30 * 0xff) * 0x000001;
		}

		this.sphere.material = new THREE.MeshStandardMaterial({ color: goal_color, transparent: true, opacity: 0.5 });
		this.strawberry.position.x = this.sphere.position.x - this.strawberry_offset_x;
		this.strawberry.position.y = this.sphere.position.y - this.strawberry_offset_y;
		this.strawberry.position.z = 30;
	}
	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		if (Math.max(left, this.position.x - this.size) <= Math.min(right, this.position.x + this.size)) {
			if (Math.max(bot, this.position.y - this.size) <= Math.min(top, this.position.y + this.size)) {
				this.gameRoom.wins = true;
			}
		}
	}
}


const BallScaleList = [1, 1.05, 1.1, 1.15, 1.1, 0.9, 0.7];

class BouncyBall extends GameObject {
	constructor(gameRoom, position) {
		super(gameRoom);
		this.position = position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.size = BLOCK_UNIT_SIZE + 3;

		// initialize shape
		const textureLoader = new THREE.TextureLoader();
		const image = textureLoader.load('./textures/pumber2.png');
		// image.encoding = THREE.sRGBEncoding;
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const rotation_matrix = new THREE.Matrix4();
		rotation_matrix.makeRotationY(-Math.PI / 2);
		geometry.applyMatrix4(rotation_matrix);
		const material = new THREE.MeshStandardMaterial({ map: image, emissiveMap: image, emissiveIntensity: 0.8, emissive: 0xffffff });
		// const material = new THREE.MeshStandardMaterial();
		this.sphere = new THREE.Mesh(geometry, material);
		this.original_geometry = this.sphere.geometry.clone();
		this.gameRoom.scene.add(this.sphere);
		this.touch_direction = new THREE.Vector2(0, 1);

		this.iter = 0;
	}
	onStep() {
		if (this.iter > 0) {
			this.iter -= 1;
		}
	}
	onRender() {
		this.sphere.position.x = this.position.x;
		this.sphere.position.y = this.position.y;
		this.sphere.position.z = 0;
		// window.alert([this.sphere.position.x, this.sphere.position.y, this.sphere.position.z]);

		/*
		this.sphere.scale.x = BallScaleList[this.iter];
		this.sphere.scale.y = BallScaleList[this.iter];
		this.sphere.scale.z = BallScaleList[this.iter];
		*/
		this.sphere.geometry = this.original_geometry.clone();
		const compression_matrix = utils.get_compress_matrix(this.touch_direction, BallScaleList[this.iter], true);
		this.sphere.geometry.applyMatrix4(compression_matrix);
	}
	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		var touched = false;

		if (left - this.size < this.position.x && this.position.x < right + this.size && bot < this.position.y && this.position.y < top) {
			touched = true;
		}
		else if (left < this.position.x && this.position.x < right && bot - this.size < this.position.y && this.position.y < top + this.size) {
			touched = true;
		}
		else if (this.position.distanceTo(new THREE.Vector2(left, top)) < this.size) {
			touched = true;
		}
		else if (this.position.distanceTo(new THREE.Vector2(left, bot)) < this.size) {
			touched = true;
		}
		else if (this.position.distanceTo(new THREE.Vector2(right, top)) < this.size) {
			touched = true;
		}
		else if (this.position.distanceTo(new THREE.Vector2(right, bot)) < this.size) {
			touched = true;
		}

		if (touched) {
			// set player status
			player.cancelDash();
			player.dash_cd = 6;
			player.dash_refresh_cd = 0;
			player.dash_count = Math.max(player.dash_count, player.max_dash_count);

			// set player speed
			let vx = player.position.x - this.position.x;
			let vy = player.position.y + 5 - this.position.y;
			let norm = Math.sqrt(vx * vx + vy * vy);
			vx = vx * 325 / norm / 60;
			vy = vy * 325 / norm / 60;
			if (vy > 0 || Math.abs(vx) > -vy * 1.1) {
				vy += 2.2;
			}
			vy = Math.min(vy, 4);
			if (vx < -1 && player.direction == DIRECTION_LEFT)
				vx -= 0.6;
			if (vx > 1 && player.direction == DIRECTION_RIGHT)
				vx += 0.6;
			player.velocity.x = vx;
			player.velocity.y = vy;

			// set ball status
			this.iter = 6;
			this.touch_direction = new THREE.Vector2(vx, vy);

			// play sound effects
			utils.play_effect('pumber');
		}
	}
}


class DashRefresher extends GameObject {
	constructor(gameRoom, position, refresh_count = 1) {
		super(gameRoom);
		this.position = position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.size = 6;
		this.refresh_count = refresh_count;
		this.timer = 0;
		this.ready = 0;

		// initialize shape
		if (this.refresh_count == 1) {
			const geometry = new THREE.BoxGeometry(7, 7, 7);  // To be modified
			const material = new THREE.MeshStandardMaterial({ color: 0xc4ffc4, transparent: true, opacity: 0.8 });
			this.box = new THREE.Mesh(geometry, material);
		}
		else {
			const geometry = new THREE.BoxGeometry(9, 9, 9);  // To be modified
			const material = new THREE.MeshStandardMaterial({ color: 0xffc3fc, transparent: true, opacity: 0.8 });
			this.box = new THREE.Mesh(geometry, material);
		}
		this.box.rotation.x = Math.PI / 4;
		this.box.rotation.y = Math.atan(Math.sqrt(2));
		
		this.gameRoom.scene.add(this.box);
	}
	reset() {
		this.timer = 0;
		if (this.ready > 0) {
			this.gameRoom.scene.add(this.box);
		}
		this.ready = 0;
	}
	onStep() {
		this.timer += 1;
		if (this.ready > 0) {
			this.ready -= 1;
			if (this.ready == 0) {
				this.gameRoom.scene.add(this.box);
				utils.play_effect('refresh');
			}
		}
		this.box.rotation.x += 0.01
		this.box.rotation.y += 0.01
	}
	onRender() {
		this.box.position.x = this.position.x;
		this.box.position.y = this.position.y + 2 * Math.sin(this.timer * 0.04);
		this.box.position.z = 0;
	}
	playerInteraction(player) {
		if (this.ready > 0)
			return;
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		if (Math.max(left, this.position.x - this.size) <= Math.min(right, this.position.x + this.size)) {
			if (Math.max(bot, this.position.y - this.size) <= Math.min(top, this.position.y + this.size)) {
				if (player.dash_count < this.refresh_count) {
					player.dash_count = this.refresh_count;
					this.ready = 180;
					this.gameRoom.scene.remove(this.box);
					utils.play_effect('crystal');
				}
			}
		}
	}
}


class AccelerationRing extends GameObject {
	constructor(gameRoom, position, direction) {
		// type: 0-vertical, 1-horizontal
		super(gameRoom);
		this.position = position.clone();
		this.type = direction;
		this.radius = 2 * BLOCK_UNIT_SIZE;
		this.tube = 3;

		// initialize shape
		const geometry = new THREE.TorusGeometry(2 * BLOCK_UNIT_SIZE - 2, 2);
		const effect_color = 0xffffff
		const material = new THREE.MeshStandardMaterial({ color: effect_color, transparent: true, opacity: 0.5, emissiveIntensity: 0.5, emissive: effect_color });
		this.ring = new THREE.Mesh(geometry, material);
		if (this.type == 1)
			this.ring.rotation.y += Math.PI / 2;
		if (this.type == 0)
			this.ring.rotation.x += Math.PI / 2;
		this.gameRoom.scene.add(this.ring);
	}

	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		var touched = false;

		if (this.type == 0) {
			if (Math.max(left, this.position.x - this.radius) <= Math.min(right, this.position.x + this.radius)) {
				if (Math.max(bot, this.position.y - this.tube) <= Math.min(top, this.position.y + this.tube)) {
					touched = true;
					if (player.velocity.y >= 0) {
						player.velocity.y += 4.0;
						player.position.y = Math.max(this.position.y, player.position.y);
					}
					else {
						player.velocity.y = -4.0;
						player.position.y = Math.min(this.position.y - 12, player.position.y);
					}
				}
			}
		}
		else {
			if (Math.max(left, this.position.x - this.tube) <= Math.min(right, this.position.x + this.tube)) {
				if (Math.max(bot, this.position.y - this.radius) <= Math.min(top, this.position.y + this.radius)) {
					touched = true;
					if (player.velocity.x > 0) {
						player.velocity.y += 1.2;
						player.velocity.x += 3.5;
						player.position.x = Math.max(this.position.x + 2.8, player.position.x);
					}
					if (player.velocity.x < 0) {
						player.velocity.y += 1.2;
						player.velocity.x -= 3.5;
						player.position.x = Math.min(this.position.x - 2.8, player.position.y);
					}
				}
			}
		}

		if (touched) {
			player.cancelDash();
			player.dash_count = Math.max(player.dash_count, player.max_dash_count);
			// TODO: play sound effect.
		}
	}

	onRender() {
		this.ring.position.x = this.position.x;
		this.ring.position.y = this.position.y;
		this.ring.position.z = 0;
	}
}


export function get_special_object(gameRoom, obj) {
	if (obj.type == "GameGoal") {
		return new GameGoal(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE));
	}
	else if (obj.type == "BouncyBall") {
		return new BouncyBall(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE));
	}
	else if (obj.type == "DashRefresher") {
		return new DashRefresher(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE), obj.refresh_count);
	}
	else if (obj.type == "AccelerationRing") {
		return new AccelerationRing(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE), obj.direction);
	}
	else {
		window.alert("Error: Invalid object type!");
	}
}