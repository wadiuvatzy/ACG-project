import * as THREE from 'three';

class GameObject {
	constructor(gameRoom) {
		this.gameRoom = gameRoom;
		this.added_to_scene = false;
	}
	// setup the initial state of the object
	reset() {

	}
	// Compute what should happen during this frame.
	onStep() {

	}
	// Compute the pose for this object.
	onRender() {

	}
}