import { GameObject, Player } from 'objects';
import * as THREE from 'three'

class Block extends GameObject {
	constructor(gameRoom, initial_position, width, height) {
		super(gameRoom);
		this.initial_position = initial_position.clone(); // left-bottom position
		this.width = width;
		this.height = height;
		// TODO: initialize the 3D object and its tiles.
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

	}
	onRender() {

	}
}

// TODO: add other blocks
// DropBlock: when the player stands on it, it drops.
// WeakBlock: breaks after the player touches it / the player dashes to it / a DropBlock drops on it, depending its type.