import * as THREE from 'three'
import { GameObject } from 'objects'
import * as utils from 'utils'

const PLAYER_HEIGHT_2D = 12;
const PLAYER_WIDTH_2D = 8;

const DIRECTION_LEFT = 0;
const DIRECTION_RIGHT = 1;

const AIRJUMP_TIME_LIMIT = 5;
const BOOST_TIME_LIMIT = 5;

const DASH_TIME_EXTENDED = 17;
const DASH_CD = 13;
const DASH_REFRESH_CD = 8;

class Player extends GameObject {
	constructor(gameRoom, initial_position, initial_direction) {
		super(gameRoom);

		// position.x = horizontal(right positive), position.y = vertical(up positive).
		this.initial_position = initial_position.clone();
		
		// TODO: create the 3D object.


		// initialize the other attributes.
		this.reset();
	}

	// helper functions
	getUpper(target_position = this.position) { return target_position.y + PLAYER_HEIGHT_2D; }
	getLower(target_position = this.position) { return target_position.y; }
	getLeft(target_position = this.position) { return target_position.x - PLAYER_WIDTH_2D * 0.5; }
	getRight(target_position = this.position) { return target_position.x + PLAYER_WIDTH_2D * 0.5; }

	reset() {
		// initialize positions
		this.position = initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0); // expected velocity, could be blocked by blocks.
		this.initial_direction = initial_direction;

		// for dashing
		this.max_dash_count = 1;
		this.dash_count = 1;
		this.dash_cd = 0; // when > 0, cannot dash.
		this.dash_refresh_cd = 0; // when > 0, cannot refresh on the block.
		this.dash_time_remains = 0; // The remaining seconds for 'dash-time'.

		// for jumping
		this.airjump_time = 0;

		// for moving blocks
		this.recent_touch_velocities = [];
		this.recent_touch_time = [];

		// standing on blocks
		this.standing_on = null;

		this.should_be_killed = false;

		// initialize 3D shape;

	}

	// which blocks the player collides when on that position.
	getCollision(target_position) {
		var blocks = [];
		for (var block of this.gameRoom.blocks) {
			if (Math.max(this.getLeft(target_position), block.getLeft()) < Math.min(this.getRight(target_position), block.getRight())) {
				if (Math.max(this.getLower(target_position), block.getLower()) < Math.min(this.getUpper(target_position), block.getUpper())) {
					blocks.push(block);
				}
			}
		}
		return blocks;
	}
	// handle movements, raise collision events
	handleMovement() {
		// movement phase
		// find whether could move to the target directly.
		var target_position = new THREE.Vector2();
		target_position.addVectors(this.position, this.velocity);
		let collision_blocks = this.getCollision(target);
		if (collision_blocks.length == 0) {
			this.position = target_position;
		}
		else {
			// horizontal, then vertical
			let target_movement = this.velocity.x;
			let movement_ub = 1e9;
			let movement_lb = -1e9;
			for (var block of this.gameRoom.blocks) {
				if (Math.max(this.getLower(), block.getLower()) < Math.min(this.getUpper(), block.getUpper())) {
					let distance = block.getLeft() - this.getRight();
					if (distance >= block.velocity.x)
						movement_ub = Math.min(movement_ub, distance);
					distance = block.getRight() - this.getLeft();
					if (distance <= block.velocity.x)
						movement_lb = Math.max(movement_lb, distance);
				}
			}
			if (movement_lb > movement_ub)
				this.should_be_killed = true;
			else {
				target_movement = Math.max(target_movement, movement_lb);
				target_movement = Math.min(target_movement, movement_ub);
			}
		}
		
		// state(including standing on which block, including ) computing phase

	}
	// handle player control
	handlePlayerControl() {
		var keyboardValue = utils.getKeyboardValue();
	}
	// main simulation
	onStep() {
		this.handleMovement();
		this.handlePlayerControl();
	}
	// setup the position and pose of the player object.
	onRender() {

	}
}
