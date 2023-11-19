import { GameObject } from '../objects';

const SPIKE_RADIUS = 9;

class Spike extends GameObject {
	constructor(gameRoom, initial_position, attached_to) {
		super(gameRoom);
		this.initial_position = initial_position.clone();
		this.attached_to = attached_to;
		this.size = SPIKE_RADIUS;

		this.reset();
		// TODO: initialize the 3D object and its tiles.
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
		// TODO
	}
}

export default Spike;