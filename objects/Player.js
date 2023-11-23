import * as THREE from 'three'
import { GameObject } from '../objects'
import * as utils from '../utils'

const PLAYER_HEIGHT_2D = 12;
const PLAYER_WIDTH_2D = 8;

export const DIRECTION_LEFT = 0;
export const DIRECTION_RIGHT = 1;
export const GRAVITY = 0.25;

const AIRJUMP_TIME_LIMIT = 5;
const BOOST_TIME_LIMIT = 5;
const JUMP_BOOST = 40.0 / 60
const JUMP_SPEED_Y = 2.2;

const FORWARD_SPEED = 1.5;
const SMALLER_RESISTANCE = 4.3 / 60;
const BIGGER_RESISTANCE = 10.8 / 60;

const DASH_TIME = 10;
const DASH_CD = 10;
const DASH_REFRESH_CD = 6;
const DASH_VELOCITY_BASE = 240.0 / 60;
const SUPER_SPEED = 240.0 / 60;
const HYPER_SPEED = 325.0 / 60;

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
	
	constructor(gameRoom, initial_position, initial_direction = DIRECTION_RIGHT) {
		super(gameRoom);

		// position.x = horizontal(right positive), position.y = vertical(up positive).
		this.initial_position = initial_position.clone();
		this.initial_direction = initial_direction;
		
		// Create the 3D object.
		const geometry = new THREE.BoxGeometry(PLAYER_WIDTH_2D, PLAYER_HEIGHT_2D, PLAYER_WIDTH_2D);
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		this.box = new THREE.Mesh(geometry, material);
		this.gameRoom.scene.add(this.box);

		// initialize the other attributes.
		this.reset();
	}

	// helper functions
	getUpper(target_position = this.position) {
		return target_position.y + PLAYER_HEIGHT_2D;
	}
	getLower(target_position = this.position) { return target_position.y; }
	getLeft(target_position = this.position) { return target_position.x - PLAYER_WIDTH_2D * 0.5; }
	getRight(target_position = this.position) { return target_position.x + PLAYER_WIDTH_2D * 0.5; }
	
	reset() {
		// initialize positions
		this.position = this.initial_position.clone();
		this.velocity = new THREE.Vector2(0, 0); // expected velocity, could be blocked by blocks.
		this.direction = this.initial_direction;

		// for dashing
		this.max_dash_count = 1;
		this.dash_count = 1;
		this.dash_cd = 0; // when > 0, cannot dash.
		this.dash_refresh_cd = 0; // when > 0, cannot refresh on the block.
		this.dash_time_remains = 0; // The remaining seconds for 'dash-time'.
		this.dash_direction = DASH_DIRECTION_NONE;

		// for jumping
		this.airjump_time = 0;

		// for hyper
		this.can_hyper = false;

		// for moving blocks
		this.recent_touch_velocity = new THREE.Vector2(0, 0);
		this.recent_touch_time_x = 0;
		this.recent_touch_time_y = 0;

		// touching blocks
		this.standing_on = null;
		this.touch_left = false;
		this.touch_right = false;

		this.should_be_killed = false;

		// initialize 3D shape;
		
	}

	// which blocks the player collides when on that position.
	getCollision(target_position) {
		var blocks = [];
		for (const block of this.gameRoom.blocks) {
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
		for (const block of candidateBlocks) {
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
		if (this.standing_on != null) {
			target_velocity.addVectors(target_velocity, this.standing_on.velocity);
		}
		// window.alert("velocity:(" + this.velocity.x + "," + this.velocity.y + ")");
		// window.alert("position:(" + this.position.x + "," + this.position.y + ")");
		var target_position = new THREE.Vector2();
		target_position.addVectors(this.position, target_velocity);

		let collision_blocks = this.getCollision(target_position);

		if (collision_blocks.length == 0) {
			this.position = target_position;
		}
		else {
			// horizontal, then vertical
			var movement_ub = 1e9;
			var movement_lb = -1e9;
			for (const block of this.gameRoom.blocks) {
				if (Math.max(this.getLower(), block.getLower()) < Math.min(this.getUpper(), block.getUpper())) {
					let distance = block.getLeft() - this.getRight();
					if (distance >= block.velocity.x)
						movement_ub = Math.min(movement_ub, distance - 1e-3);
					distance = block.getRight() - this.getLeft();
					if (distance <= block.velocity.x)
						movement_lb = Math.max(movement_lb, distance + 1e-3);
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
			for (const block of this.gameRoom.blocks) {
				if (Math.max(this.getLeft(), block.getLeft()) < Math.min(this.getRight(), block.getRight())) {
					let distance = block.getLower() - this.getUpper();
					if (distance >= block.velocity.y)
						movement_ub = Math.min(movement_ub, distance - 1e-3);
					distance = block.getUpper() - this.getLower();
					if (distance <= block.velocity.y)
						movement_lb = Math.max(movement_lb, distance + 1e-3);
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
		if (this.standing_on != null)
			this.airjump_time = AIRJUMP_TIME_LIMIT;
		else if (this.airjump_time > 0)
			this.airjump_time = this.airjump_time - 1;

		// for diagonal dashes, if hits the ground, change to horizontal dash and give a 1.2 multiplier to the horizontal speed.
		if (this.dash_direction == DASH_DIRECTION_LEFT_DOWN && this.standing_on != null) {
			this.dash_direction = DASH_DIRECTION_LEFT;
			this.velocity.y = 0;
			this.velocity.x = this.velocity.x * 1.2;
		}
		if (this.dash_direction == DASH_DIRECTION_RIGHT_DOWN && this.standing_on != null) {
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
		if (this.dash_refresh_cd <= 0 && this.standing_on != null) {
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

		// parse speeds from nearby objects
		// standing on
		if (this.standing_on != null) {
			if (this.standing_on.velocity.y > 1e-3) {
				this.recent_touch_time_y = BOOST_TIME_LIMIT;
				this.recent_touch_velocity.y = this.standing_on.velocity.y;
			}
			if (Math.abs(this.standing_on.velocity.x) > 1e-3) {
				this.recent_touch_time_x = BOOST_TIME_LIMIT;
				this.recent_touch_velocity.x = this.standing_on.velocity.x;
			}
			if (this.dash_time_remains <= 0 && this.velocity.y < 0)
				this.velocity.y = 0;
		}
		// from side
		let touch_left = this.getCollision(new THREE.Vector2(this.position.x - 1.5, this.position.y));
		let touch_right = this.getCollision(new THREE.Vector2(this.position.x + 1.5, this.position.y));
		this.touch_left = touch_left.length > 0;
		this.touch_right = touch_right.length > 0;
		// window.alert("touch_right:" + this.touch_right);
		var velocity_x = 0.0;
		if (this.direction == DIRECTION_LEFT) {
			for (const block of touch_left) {
				velocity_x = Math.max(velocity_x, block.velocity.x);
					
			}
			if (velocity_x <= 0.0) {
				for (const block of touch_right) {
					velocity_x = Math.min(velocity_x, block.velocity.x);
				}
			}
		}
		else {
			for (const block of touch_right) {
				velocity_x = Math.min(velocity_x, block.velocity.x);
			}
			if (velocity_x >= 0.0) {
				for (const block of touch_right) {
					velocity_x = Math.max(velocity_x, block.velocity.x);
				}
			}
		}
		if (Math.abs(velocity_x) > 1e-3) {
			if (this.recent_touch_time_x == BOOST_TIME_LIMIT)
				this.recent_touch_velocity.x = this.recent_touch_velocity.x + velocity_x;
			else {
				this.recent_touch_time_x = BOOST_TIME_LIMIT;
				this.recent_touch_velocity.x = velocity_x;
			}
		}

		if (this.recent_touch_time_x > 0)
			this.recent_touch_time_x = this.recent_touch_time_x - 1;
		if (this.recent_touch_time_x <= 0)
			this.recent_touch_velocity.x = 0;
		if (this.recent_touch_time_y > 0)
			this.recent_touch_time_y = this.recent_touch_time_y - 1;
		if (this.recent_touch_time_y <= 0)
			this.recent_touch_velocity.y = 0;

		// collision -> clear speed
		if (this.dash_time_remains <= 0) {
			let touch_up = this.getCollision(new THREE.Vector2(this.x, this.y + 1));
			for (const block of touch_up) {
				this.velocity.y = Math.min(this.velocity.y, block.velocity.y);
			}
			for (const block of touch_left) {
				if (block.velocity.x >= 0 && this.velocity.x < 0 && this.dash_time_remains <= 0)
					this.velocity.x = 0;
			}
			for (const block of touch_right) {
				if (block.velocity.x <= 0 && this.velocity.x > 0 && this.dash_time_remains <= 0)
					this.velocity.x = 0;
			}
		}
	}

	// handle interactive objects such as spikes, breakable blocks, pumbers and springs.
	handleInteractiveObjects() {
		// TODO
	}

	handleDash(keyboardValue) {
		// parse dash
		if (keyboardValue.DashPressed && this.dash_count > 0 && this.dash_cd <= 0) {
			this.can_hyper = false;
			// update dash states
			this.dash_cd = DASH_CD;
			this.dash_refresh_cd = DASH_REFRESH_CD;
			this.dash_time_remains = DASH_TIME;
			this.dash_count = this.dash_count - 1;

			// perform dash
			var dash_velocity = new THREE.Vector2(0, 0);
			this.dash_direction = DASH_DIRECTION_NONE;
			if (!keyboardValue.Left && !keyboardValue.Right) {
				if (keyboardValue.Up && !keyboardValue.Down) {
					this.dash_direction = DASH_DIRECTION_UP;
					dash_velocity.x = 0;
					dash_velocity.y = DASH_VELOCITY_BASE;
				}
				else if (keyboardValue.Down && !keyboardValue.Up) {
					this.dash_direction = DASH_DIRECTION_DOWN;
					dash_velocity.x = 0;
					dash_velocity.y = -1.17 * DASH_VELOCITY_BASE;
				}
			}
			if (this.dash_direction == DASH_DIRECTION_NONE) {
				if (this.direction == DIRECTION_LEFT) {
					if (keyboardValue.Up && !keyboardValue.Down) {
						this.dash_direction = DASH_DIRECTION_LEFT_UP;
						dash_velocity.x = -DASH_VELOCITY_BASE / 1.4;
						dash_velocity.y = DASH_VELOCITY_BASE / 1.4;
					}
					else if (keyboardValue.Down && !keyboardValue.Up) {
						this.can_hyper = true;
						this.dash_direction = DASH_DIRECTION_LEFT_DOWN;
						dash_velocity.x = -DASH_VELOCITY_BASE / 1.2;
						dash_velocity.y = -DASH_VELOCITY_BASE / 1.2;
					}
					else {
						this.dash_direction = DASH_DIRECTION_LEFT;
						dash_velocity.x = -DASH_VELOCITY_BASE;
						dash_velocity.y = 0;
					}
				}
				if (this.direction == DIRECTION_RIGHT) {
					if (keyboardValue.Up && !keyboardValue.Down) {
						this.dash_direction = DASH_DIRECTION_RIGHT_UP;
						dash_velocity.x = DASH_VELOCITY_BASE / 1.4;
						dash_velocity.y = DASH_VELOCITY_BASE / 1.4;
					}
					else if (keyboardValue.Down && !keyboardValue.Up) {
						this.can_hyper = true;
						this.dash_direction = DASH_DIRECTION_RIGHT_DOWN;
						dash_velocity.x = DASH_VELOCITY_BASE / 1.2;
						dash_velocity.y = -DASH_VELOCITY_BASE / 1.2;
					}
					else {
						this.dash_direction = DASH_DIRECTION_RIGHT;
						dash_velocity.x = DASH_VELOCITY_BASE;
						dash_velocity.y = 0;
					}
				}
			}
			// should be at least as fast as before
			if (dash_velocity.x > 0)
				dash_velocity.x = Math.max(dash_velocity.x, this.velocity.x);
			if (dash_velocity.x < 0)
				dash_velocity.x = Math.min(dash_velocity.x, this.velocity.x);
			// obtain speed boost
			if (dash_velocity.x < 0 && this.recent_touch_velocity.x < 0)
				dash_velocity.x += this.recent_touch_velocity.x;
			if (dash_velocity.x > 0 && this.recent_touch_velocity.x > 0)
				dash_velocity.x += this.recent_touch_velocity.x;

			// update velocity to the dash velocity
			this.velocity = dash_velocity;
		}
	}

	handleJump(keyboardValue) {
		var jumped = false;
		if (keyboardValue.JumpPressed) {
			// ground jump
			if (this.airjump_time > 0) {
				this.airjump_time = 0;
				// parse the jump: super-dash or hyper-dash, or just a normal jump.
				if (this.dash_time_remains > 0 && this.can_hyper) {
					// hyper dash
					if (this.direction == DIRECTION_LEFT) {
						this.velocity.x = -HYPER_SPEED;
						this.velocity.y = JUMP_SPEED_Y * 0.8;
					}
					else {
						this.velocity.x = HYPER_SPEED;
						this.velocity.y = JUMP_SPEED_Y * 0.8;
					}
				}
				else if (this.dash_time_remains > 0 && this.dash_direction == DASH_DIRECTION_LEFT || this.dash_direction == DASH_DIRECTION_RIGHT) {
					// super dash
					if (this.direction == DIRECTION_LEFT) {
						this.velocity.x = -SUPER_SPEED;
						this.velocity.y = JUMP_SPEED_Y;
					}
					else {
						this.velocity_x = SUPER_SPEED;
						this.velocity.y = JUMP_SPEED_Y;
					}
				}
				else {
					// just a normal ground jump
					if (keyboardValue.Left && !keyboardValue.Right) {
						this.velocity.x -= JUMP_BOOST;
						this.velocity.y = JUMP_SPEED_Y;
					}
					else if (keyboardValue.Right && !keyboardValue.Left) {
						this.velocity.x += JUMP_BOOST;
						this.velocity.y = JUMP_SPEED_Y;
					}
					else {
						this.velocity.y = JUMP_SPEED_Y;
					}
				}
				jumped = true;
			}
			else {
				// window.alert("Consider wall jump?");
				// consider wall-jumps
				let could_wall_bounce = (this.dash_time_remains > 0 && this.dash_direction == DASH_DIRECTION_UP);
				// window.alert("Consider wall bounce?");
				if (this.direction == DIRECTION_LEFT) {
					if (this.touch_left) {
						if (could_wall_bounce) {
							this.velocity.x = 2.0;
							this.velocity.y = 1.3 * JUMP_SPEED_Y;
						}
						else {
							this.velocity.x = 1.5;
							this.velocity.y = JUMP_SPEED_Y;
						}
						if (keyboardValue.Left || keyboardValue.Right)
							this.velocity.x += JUMP_BOOST;
						jumped = true;
					}
					else if (this.touch_right) {
						if (could_wall_bounce) {
							this.velocity.x = -2.0;
							this.velocity.y = 1.3 * JUMP_SPEED_Y;
						}
						else {
							this.velocity.x = -1.5;
							this.velocity.y = JUMP_SPEED_Y;
						}
						if (keyboardValue.Left || keyboardValue.Right)
							this.velocity.x -= JUMP_BOOST;
						jumped = true;
					}
				}
				else {
					// window.alert("attach right?");
					if (this.touch_right) {
						if (could_wall_bounce) {
							this.velocity.x = -2.0;
							this.velocity.y = 1.3 * JUMP_SPEED_Y;
						}
						else {
							this.velocity.x = -1.5;
							this.velocity.y = JUMP_SPEED_Y;
						}
						if (keyboardValue.Left || keyboardValue.Right)
							this.velocity.x -= JUMP_BOOST;
						jumped = true;
					}
					else if (this.touch_left) {
						if (could_wall_bounce) {
							this.velocity.x = 2.0;
							this.velocity.y = 1.3 * JUMP_SPEED_Y;
						}
						else {
							this.velocity.x = 1.5;
							this.velocity.y = JUMP_SPEED_Y;
						}
						if (keyboardValue.Left || keyboardValue.Right)
							this.velocity.x += JUMP_BOOST;
						jumped = true;
					}
				}
			}
		}
		if (jumped) {
			// if jumps, always add the boost
			this.velocity.add(this.recent_touch_velocity);
			// if jumps, it means leaving the ground
			this.standing_on = null;
			// no matter which kind of jump it is, the dash time must be cleared.
			this.dash_time_remains = 0;
			this.dash_refresh_cd = Math.min(this.dash_refresh_cd, 2);
		}
	}

	handleSpeedChange(keyboardValue) {
		// handle accelerations caused by holding jump key and arrow keys, resistance and gravity.
		if (this.dash_time_remains <= 0) { // when dashing, do not change the speed here.
			// window.alert("handle_gravity!");
			// handle gravity
			if (this.velocity.y > 0) {
				if (keyboardValue.Jump) {
					this.velocity.y -= GRAVITY * 0.5;
				}
				else {
					this.velocity.y -= GRAVITY;
				}
			}
			else if (this.standing_on == null) {
				let target_speed = -2.6;
				if (keyboardValue.Down)
					target_speed = -4.0;
				if (this.velocity.y > target_speed) {
					if (keyboardValue.Down && this.velocity.y < -2.0) {
						this.velocity.y = Math.max(this.velocity.y - GRAVITY * 2.0, target_speed);
					}
					else {
						this.velocity.y = Math.max(this.velocity.y - GRAVITY, target_speed);
					}
				}
				else {
					this.velocity.y = Math.min(this.velocity.y + GRAVITY * 2.0, target_speed);
				}
			}
			// handle frictions
			// console.log(keyboardValue.Right);
			let friction_multiplier = 1.0;
			if (this.standing_on != null)
				friction_multiplier = 1.5;
			if (Math.abs(this.velocity.x) < friction_multiplier * BIGGER_RESISTANCE) {
				if (keyboardValue.Left && !keyboardValue.Right)
					this.velocity.x -= SMALLER_RESISTANCE;
				else if (keyboardValue.Right && !keyboardValue.Left)
					this.velocity.x += SMALLER_RESISTANCE;
				else {
					this.velocity.x = 0;
				}
			}
			else if (this.velocity.x > 0) {
				if (keyboardValue.Right) {
					if (this.velocity.x < FORWARD_SPEED) {
						this.velocity.x = Math.min(this.velocity.x + SMALLER_RESISTANCE, FORWARD_SPEED);
					}
					else {
						this.velocity.x = Math.max(this.velocity.x - friction_multiplier * SMALLER_RESISTANCE, FORWARD_SPEED);
					}
				}
				else {
					this.velocity.x = this.velocity.x - friction_multiplier * BIGGER_RESISTANCE;
				}
			}
			else {
				if (keyboardValue.Left) {
					if (this.velocity.x > -FORWARD_SPEED) {
						this.velocity.x = Math.max(this.velocity.x - SMALLER_RESISTANCE, -FORWARD_SPEED);
					}
					else {
						this.velocity.x = Math.min(this.velocity.x + friction_multiplier * SMALLER_RESISTANCE, -FORWARD_SPEED);
					}
				}
				else {
					this.velocity.x = this.velocity.x + friction_multiplier * BIGGER_RESISTANCE;
				}
			}
		}
	}

	// handle player control
	handlePlayerControl() {
		let keyboardValue = utils.getKeyboardValue();

		// face to the target direction
		if (keyboardValue.Left && !keyboardValue.Right)
			this.direction = DIRECTION_LEFT;
		if (keyboardValue.Right && !keyboardValue.Left)
			this.direction = DIRECTION_RIGHT;

		// dash
		this.handleDash(keyboardValue);

		// jump
		this.handleJump(keyboardValue);

		// speed change
		this.handleSpeedChange(keyboardValue);
	}
	// main simulation
	onStep() {
		this.handleMovement();
		this.handleInteractiveObjects();
		this.handlePlayerControl();
		// window.alert("Successful?");
	}

	// setup the position and pose of the player object.
	onRender() {
		this.box.position.x = this.position.x;
		this.box.position.y = this.position.y + PLAYER_HEIGHT_2D * 0.5;
		this.box.position.z = 0;
		if (this.dash_count == 0) {
			this.box.material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
		}
		else if (this.dash_count == 1) {
			this.box.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		}
	}
}

export default Player;