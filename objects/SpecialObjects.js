import { GameObject, GRAVITY, BLOCK_UNIT_SIZE } from '../objects';
import * as THREE from 'three';


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


export function get_special_object(gameRoom, obj) {
	if (obj.type == "GameGoal") {
		return new GameGoal(gameRoom, new THREE.Vector2(obj.x * BLOCK_UNIT_SIZE, obj.y * BLOCK_UNIT_SIZE));
	}
	else {
		window.alert("Error: Invalid object type!");
	}
}