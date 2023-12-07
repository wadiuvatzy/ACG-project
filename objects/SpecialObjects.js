import { GameObject, GRAVITY, BLOCK_UNIT_SIZE } from '../objects';
import * as THREE from 'three';
import { DASH_DIRECTION_NONE, DIRECTION_LEFT, DIRECTION_RIGHT } from './Player';


class GameGoal extends GameObject {
	constructor(gameRoom, position) {
		super(gameRoom);
		this.position = position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.size = BLOCK_UNIT_SIZE;

		// initialize shape
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		this.sphere = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.sphere);

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

		this.sphere.material = new THREE.MeshStandardMaterial({ color: goal_color });
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


const BallScaleList = [1, 1.1, 1.23, 1.35, 1.4, 1.1, 0.8];

class BouncyBall extends GameObject {
	constructor(gameRoom, position) {
		super(gameRoom);
		this.position = position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.size = BLOCK_UNIT_SIZE;

		// initialize shape
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
		this.sphere = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.sphere);

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

		this.sphere.scale.x = BallScaleList[this.iter];
		this.sphere.scale.y = BallScaleList[this.iter];
		this.sphere.scale.z = BallScaleList[this.iter];
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
			player.dash_cd = 6;
			player.dash_refresh_cd = 0;
			player.dash_time_remains = 0;
			player.dash_direction = DASH_DIRECTION_NONE;
			player.dash_count = Math.max(player.dash_count, player.max_dash_count);

			// set player speed
			let vx = player.position.x - this.position.x;
			let vy = player.position.y - this.position.y;
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
		}
	}
}


export function get_special_object(gameRoom, obj) {
	if (obj.type == "GameGoal") {
		return new GameGoal(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE));
	}
	else {
		window.alert("Error: Invalid object type!");
	}
}