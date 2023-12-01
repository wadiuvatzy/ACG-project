import { GameObject } from '../objects';
import * as THREE from 'three';

const SPIKE_RADIUS = 5;

class Spike extends GameObject {
	constructor(gameRoom, initial_position, attached_to) {
		super(gameRoom);
		this.initial_position = initial_position.clone();
		this.attached_to = attached_to;
		this.size = SPIKE_RADIUS;

		this.reset();
		// TODO: initialize the 3D object and its tiles.
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
		this.sphere = new THREE.Mesh(geometry, material);

		this.gameRoom.scene.add(this.sphere);
	}
	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
	}
	onStep() {
		if (this.attached_to === null) {
			// do nothing.
		}
		else {
			this.velocity = this.attached_to.velocity;
			this.position.add(this.velocity);
		}
	}
	onRender() {
		this.sphere.position.x = this.position.x;
		this.sphere.position.y = this.position.y;
		this.sphere.position.z = 0;
	}
	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		if (left - this.size < this.position.x && this.position.x < right + this.size && bot < this.position.y && this.position.y < top) {
			player.should_be_killed = true;
			return;
		}
		if (left < this.position.x && this.position.x < right && bot - this.size < this.position.y && this.position.y < top + this.size) {
			player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(left, top)) < this.size) {
			player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(left, bot)) < this.size) {
			player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(right, top)) < this.size) {
			player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(right, bot)) < this.size) {
			player.should_be_killed = true;
			return;
		}
	}

}

export { Spike };