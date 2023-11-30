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
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.sphere = new THREE.Mesh(geometry, material);
	}
	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
		this.gameRoom.scene.add(this.sphere);
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
		this.box.position.z = 0;
	}
	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();
		
		if (bot < this.position.y + this.size && this.position.y + this.size < top && left < this.position.x && this.position.x < right) {
			this.player.should_be_killed = true;
			return;
		}
		if (bot < this.position.y - this.size && this.position.y - this.size < top && left < this.position.x && this.position.x < right) {
			this.player.should_be_killed = true;
			return;
		}
		if (bot < this.position.y && this.position.y < top && left < this.position.x - this.size && this.position.x - this.size < right) {
			this.player.should_be_killed = true;
			return;
		}
		if (bot < this.position.y && this.position.y < top && left < this.position.x + this.size && this.position.x + this.size < right) {
			this.player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(left, bot)) < this.size) {
			this.player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(right, bot)) < this.size) {
			this.player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(left, top)) < this.size) {
			this.player.should_be_killed = true;
			return;
		}
		if (this.position.distanceTo(new THREE.Vector2(right, top)) < this.size) {
			this.player.should_be_killed = true;
			return;
		}
		if (bot <= this.position.y && this.position.y <= top && left <= this.position.x && this.position.x <= right) {
			this.player.should_be_killed = true;
			return;
		}
	}

}

export default Spike;