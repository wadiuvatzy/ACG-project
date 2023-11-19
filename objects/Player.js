import * as THREE from 'three'
import { GameObject } from '../objects'
import * as utils from '../utils'

const PLAYER_HEIGHT_2D = 12;
const PLAYER_WIDTH_2D = 8;

export const DIRECTION_LEFT = 0;
export const DIRECTION_RIGHT = 1;

const AIRJUMP_TIME_LIMIT = 5;
const BOOST_TIME_LIMIT = 5;

const DASH_TIME = 13;
const DASH_CD = 13;
const DASH_REFRESH_CD = 8;

const DASH_DIRECTION_NONE = 0;
const DASH_DIRECTION_LEFT = 1;
const DASH_DIRECTION_RIGHT = 2;
const DASH_DIRECTION_UP = 3;
const DASH_DIRECTION_DOWN = 4;
const DASH_DIRECTION_LEFT_UP = 5;
const DASH_DIRECTION_LEFT_DOWN = 6;
const DASH_DIRECTION_RIGHT_UP = 7;
const DASH_DIRECTION_RIGHT_DOWN = 8;

class Player extends GameObject {
	constructor(gameRoom, initial_position, initial_direction) {
		super(gameRoom);

		// position.x = horizontal(right positive), position.y = vertical(up positive).
		this.initial_position = initial_position.clone();
		
		// Create the 3D object.
		const geometry = new THREE.BoxGeometry(PLAYER_WIDTH_2D, PLAYER_HEIGHT_2D, PLAYER_WIDTH_2D);
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		this.box = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.box);

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
		this.dash_direction = DASH_DIRECTION_NONE;

		// for jumping
		this.airjump_time = 0;

		// for moving blocks
		this.recent_touch_velocities = 0;
		this.recent_touch_time = 0;

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

	decideStandBlock(candidateBlocks) {
		if (candidateBlocks.length == 0)
			return null;
		var stand_block = candidateBlocks[0];
		for (var block of candidateBlocks) {
			if (Math.abs(block.velocity.x) > Math.abs(stand_block.velocity.x))
				stand_block = block;
		}
		return stand_block;
	}

	// handle movements, raise collision events
	handleMovement() {
		// movement phase
		// find whether could move to the target directly.
		var target_velocity = this.velocity.clone();
		if (this.standing_on !== null) {
			target_velocity.addVectors(target_velocity, this.standing_on.velocity);
		}
		var target_position = new THREE.Vector2();
		target_position.addVectors(this.position, target_velocity);
		
		let collision_blocks = this.getCollision(target);
		if (collision_blocks.length == 0) {
			this.position = target_position;
		}
		else {
			// horizontal, then vertical
			var movement_ub = 1e9;
			var movement_lb = -1e9;
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
			if (movement_lb > movement_ub) {
				this.should_be_killed = true;
				target_velocity.x = (movement_lb + movement_ub) * 0.5;
			}
			else {
				target_velocity.x = Math.max(target_velocity.x, movement_lb);
				target_velocity.x = Math.min(target_velocity.x, movement_ub);
			}

			movement_ub = 1e9;
			movement_lb = -1e9;
			for (var block of this.gameRoom.blocks) {
				if (Math.max(this.getLeft(), block.getLeft()) < Math.min(this.getRight(), block.getRight())) {
					let distance = block.getLower() - this.getUpper();
					if (distance >= block.velocity.y)
						movement_ub = Math.min(movement_ub, distance);
					distance = block.getUpper() - this.getLower();
					if (distance <= block.velocity.y)
						movement_lb = Math.max(movement_lb, distance);
				}
			}
			if (movement_lb > movement_ub) {
				this.should_be_killed = true;
				target_velocity.y = (movement_lb + movement_ub) * 0.5;
			}
			else {
				target_velocity.y = Math.max(target_velocity.y, movement_lb);
				target_velocity.y = Math.min(target_velocity.y, movement_ub);
			}
			this.position.add(target_velocity);
		}
		
		// state (including standing on which block and the dash state) computing phase

		// standing on which block
		let stands_on_candidate = this.getCollision(new THREE.Vector2(this.position.x, this.position.y - 1.0));
		this.standing_on = this.decideStandBlock(stands_on_candidate);

		// for diagonal dashes, if hits the ground, change to horizontal dash and give a 1.2 multiplier to the horizontal speed.
		if (this.dash_direction == DASH_DIRECTION_LEFT_DOWN && this.standing_on !== null) {
			this.dash_direction = DASH_DIRECTION_LEFT;
			this.velocity.y = 0;
			this.velocity.x = this.velocity.x * 1.2;
		}
		if (this.dash_direction == DASH_DIRECTION_RIGHT_DOWN && this.standing_on !== null) {
			this.dash_direction = DASH_DIRECTION_RIGHT;
			this.velocity.y = 0;
			this.velocity.x = this.velocity.x * 1.2;
		}

		// step the dash states
		// about dash cd & refresh
		if (this.dash_cd > 0) {
			this.dash_cd = this.dash_cd - 1;
		}
		if (this.dash_refresh_cd > 0) {
			this.dash_refresh_cd = this.dash_refresh_cd - 1;
		}
		if (this.dash_refresh_cd <= 0 && this.standing_on !== null) {
			this.dash_count = this.max_dash_count;
		}
		// about dash-time
		if (this.dash_time_remains > 0) {
			this.dash_time_remains = this.dash_time_remains - 1;
			if (this.dash_time_remains <= 0) {
				if (this.dash_direction == DASH_DIRECTION_LEFT_DOWN || this.dash_direction == DASH_DIRECTION_RIGHT_DOWN) {
					// do nothing: do not clear the speed.
				}
				else {
					// clear the speed.
					this.dash_direction = DASH_DIRECTION_NONE;
					if (this.velocity.y > 0)
						this.velocity.y = 0.3;
					if (this.velocity.x < 0)
						this.velocity.x = -1.5;
					if (this.velocity.x > 0)
						this.velocity.x = 1.5;
				}
			}
		}
	}

	// handle special objects such as breakable blocks, pumbers and springs.
	handleSpecialObjects() {
		// TODO
	}

	// handle player control
	handlePlayerControl() {
		let keyboardValue = utils.getKeyboardValue();

	}
	// main simulation
	onStep() {
		this.handleMovement();
		this.handleSpecialObjects();
		this.handlePlayerControl();
	}
	// setup the position and pose of the player object.
	onRender() {
		this.box.position.x = this.position.x;
		this.box.position.y = this.position.y + PLAYER_HEIGHT_2D * 0.5;
		if (this.dash_count == 0) {
			this.box.material.color = 0x0000ff;
		}
		else if (this.dash_count == 1) {
			this.box.material.color = 0xff0000;
		}
	}
	
}

export default Player;