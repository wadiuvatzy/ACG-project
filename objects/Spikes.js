import { GameObject } from '../objects';
import * as THREE from 'three';
import { BLOCK_UNIT_SIZE } from './Blocks';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'


const SPIKE_RADIUS = 5;

var spike_ball_loading = false;
var spike_ball_loaded = false;
var spike_ball = null;

const gltfLoader = new GLTFLoader();
const url = '../models3D/spiked_ball/scene.gltf';
gltfLoader.load(url, (gltf) => {
	spike_ball = gltf.scene;
	spike_ball.scale.set(0.2, 0.2, 0.2);
});

function load_spike_ball() {
	if (spike_ball_loading)
		return;
	spike_ball_loading = true;
	const gltfLoader = new GLTFLoader();
	const url = '../models3D/spiked_ball/scene.gltf';
	gltfLoader.load(url, (gltf) => {
		spike_ball = gltf.scene;
		window.alert("spike ball loaded!");
	});
	spike_ball_loaded = true;
}


class Spike extends GameObject {
	constructor(gameRoom, initial_position, attached_to) {
		super(gameRoom);
		this.initial_position = initial_position.clone();
		this.attached_to = attached_to;
		this.size = SPIKE_RADIUS;

		this.reset();
		// TODO: initialize the 3D object and its tiles.
		const geometry = new THREE.SphereGeometry(this.size, 16, 16);  // To be modified
		const material = new THREE.MeshStandardMaterial({ color: 0x7f0000, transparent: true, opacity: 0.4 });
		this.sphere = new THREE.Mesh(geometry, material);

		/*
		this.spike_ball = null;
		load_spike_ball();
		while (!spike_ball_loaded) { }

		const root = spike_ball.clone();
		this.spike_ball = root.children[0];
		this.spike_ball.scale.set(1, 1, 1);
		this.gameRoom.scene.add(root);

		let spike_mesh = root.getObjectByName("Projectile2HP_map1_0");
		spike_mesh.geometry.computeBoundingBox();
		spike_mesh.geometry.center();
		*/

		// change to the 3D model here (copy spike_ball)
		this.spike3D = spike_ball.clone();
		this.gameRoom.scene.add(this.spike3D);

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
		this.spike3D.position.x = this.position.x;
		this.spike3D.position.y = this.position.y;
		this.spike3D.position.z = 0
		/*
		this.spike_ball.position.x = this.box.position.x;
		this.spike_ball.position.y = this.box.position.y;
		this.spike_ball.position.z = this.box.position.z;
		*/
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


class DeadlyBlock extends GameObject {
	constructor(gameRoom, initial_position, width, height) {
		super(gameRoom);
		this.initial_position = initial_position.clone();
		this.width = width;
		this.height = height;

		this.reset();

		const geometry = new THREE.BoxGeometry(this.width, this.height, 5 * BLOCK_UNIT_SIZE);
		const material = new THREE.MeshStandardMaterial({ color: 0x7f0000 });
		this.box = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.box);
	}
	reset() {
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0);
	}
	onStep() {
		// do nothing
	}
	onRender() {
		this.box.position.x = this.position.x + this.width * 0.5;
		this.box.position.y = this.position.y + this.height * 0.5;
		this.box.position.z = 0;
	}
	playerInteraction(player) {
		// collision
		let top = player.getUpper();
		let bot = player.getLower();
		let left = player.getLeft();
		let right = player.getRight();

		if (Math.max(this.position.x, left) < Math.min(this.position.x + this.width, right)) {
			if (Math.max(this.position.y, bot) < Math.min(this.position.y + this.height, top)) {
				player.should_be_killed = true;
			}
		}
	}
}


export { Spike, DeadlyBlock };