import { GameObject, GRAVITY } from '../objects';
import * as THREE from 'three';

export const BLOCK_UNIT_SIZE = 8;
export const BLOCK_NORMAL = 0;
export const BLOCK_WEAK = 1;
export const BLOCK_DROP = 2;

class Block extends GameObject {
	constructor(gameRoom, initial_position, width, height) {
		super(gameRoom);
		this.initial_position = initial_position.clone(); // left-bottom position
		this.width = width;
		this.height = height;
		this.type = BLOCK_NORMAL;

		this.reset()

		// Initialize the 3D object and its tiles.
		const geometry = new THREE.BoxGeometry(this.width, this.height, 5 * BLOCK_UNIT_SIZE);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		this.box = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.box);
	}

	getUpper(target_position = this.position) { return target_position.y + this.height; }
	getLower(target_position = this.position) { return target_position.y; }
	getLeft(target_position = this.position) { return target_position.x; }
	getRight(target_position = this.position) { return target_position.x + this.width; }

	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
	}
	onStep() {
		this.position.add(this.velocity);
	}
	onRender() {
		this.box.position.x = this.position.x + this.width * 0.5;
		this.box.position.y = this.position.y + this.height * 0.5;
		this.box.position.z = 0;
	}
}

// TODO: add other blocks
// DropBlock: when the player stands on it, it drops.
// WeakBlock: breaks after the player touches it / the player dashes to it / a DropBlock drops on it, depending its type.

class DropBlock extends Block {
	constructor(gameRoom, initial_position, width, height) {
		super(gameRoom, initial_position, width, height);

		this.type = BLOCK_DROP;

		// Initialize the 3D object and its tiles.
		this.box.material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
	}
	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.drop_timer = -1;  // -1 means not triggered, positive means triggered but not dropped, and 0 means dropping.
	}
	onStep() {
		if (this.drop_timer == 0) {
			this.velocity.y = Math.max(-2.6, this.velocity.y - GRAVITY);
			// compute maximum drop distance
			var reset_speed = false;
			var reset_to = -2.6;
			var target_block = null;
			for (const block of this.gameRoom.blocks) {
				if (Math.max(this.getLeft(), block.getLeft()) < Math.min(this.getRight(), block.getRight())) {
					let distance = this.getLower() - block.getUpper();
					if (distance >= 0) {
						if (this.velocity.y < -distance) {
							this.velocity.y = -distance;
							reset_speed = true;
							reset_to = Math.max(block.velocity.y, -2.6);
							target_block = block;
						}
						else if (this.velocity.y <= -distance) {
							reset_speed = true;
							// reset_to = Math.max(block.velocity.y, reset_to);
							if (block.velocity.y > reset_to) {
								reset_to = block.velocity.y;
								target_block = block;
							}
						}
					}
				}
			}
			this.position.add(this.velocity);
			if (reset_speed) {
				this.velocity.y = reset_to;
				if (target_block.type == BLOCK_WEAK)
					target_block.Breaks();
			}
		}
		else if (this.drop_timer > 0){
			this.drop_timer -= 1;
		}
	}
	playerInteraction(player) {
		var player_is_on = (player.standing_on == this);
		if (this.drop_timer == -1) {
			if (player_is_on)
				this.drop_timer = 40;
		}
		else {
			if (!player_is_on)
				this.drop_timer = 0;
		}
	}
}

class WeakBlock extends Block {
	constructor(gameRoom, initial_position, width, height) {
		super(gameRoom, initial_position, width, height);

		this.type = BLOCK_WEAK;

		// Initialize the 3D object and its tiles.
		this.box.material = new THREE.MeshStandardMaterial({ color: 0x008f00 });
	}
	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		if (this.crashed) {
			this.gameRoom.scene.add(this.box);
		}
		this.crashed = false;
	}
	Breaks() { // called at the onStep function of DropBlock class and playerInteraction of this class
		this.crashed = true;
		this.gameRoom.scene.remove(this.box);
		this.position = new THREE.Vector2(-100, -100);
	}
	playerInteraction(player) {
		if (player.dash_time_remains <= 0)
			return;
		// touches this block at this frame
		if (Math.max(player.getLeft(), this.getLeft() - 1) > Math.min(player.getRight(), this.getRight() + 1))
			return;
		if (Math.max(player.getLower(), this.getLower() - 1) > Math.min(player.getUpper(), this.getUpper() + 1))
			return;
		// would touch this block at the next frame (if is not stopped)
		var player_target_position = new THREE.Vector2(player.position.x + player.velocity.x, player.position.y + player.velocity.y);
		if (Math.max(player.getLeft(player_target_position), this.getLeft()) >= Math.min(player.getRight(player_target_position), this.getRight()))
			return;
		if (Math.max(player.getLower(player_target_position), this.getLower()) >= Math.min(player.getUpper(player_target_position), this.getUpper()))
			return;
		// this block breaks, and the player stops.
		this.Breaks();
		// stop dashing
		player.dash_time_remains = 0;
		player.dash_direction = 0;
		player.velocity.y = 1.6;
		if (player.velocity.x > 0)
			player.velocity.x = -1.2;
		else if (player.velocity.x < 0)
			player.velocity.x = 1.2;
		else
			player.velocity.x = 0;
	}
	onRender() {
		if (!this.crashed) {
			this.box.position.x = this.position.x + this.width * 0.5;
			this.box.position.y = this.position.y + this.height * 0.5;
			this.box.position.z = 0;
		}
	}
}


export { Block, WeakBlock, DropBlock };