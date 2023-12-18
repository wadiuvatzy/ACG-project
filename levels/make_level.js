
import * as game_objects from '../objects';
import * as THREE from 'three';
import { BLOCK_UNIT_SIZE } from '../objects/Blocks';
import { CameraTrigger } from '../app/GameRoom';

function create_block(gameRoom, data) {
	let block_type = data.type;
	let x = data.x * BLOCK_UNIT_SIZE;
	let y = data.y * BLOCK_UNIT_SIZE;
	let w = data.w * BLOCK_UNIT_SIZE;
	let h = data.h * BLOCK_UNIT_SIZE;

	let position = new THREE.Vector2(x, y);

	if (block_type == "Block")
		gameRoom.blocks.push(new game_objects.Block(gameRoom, position, w, h));
	else if (block_type == "DropBlock")
		gameRoom.blocks.push(new game_objects.DropBlock(gameRoom, position, w, h));
	else if (block_type == "WeakBlock")
		gameRoom.blocks.push(new game_objects.WeakBlock(gameRoom, position, w, h));
	else if (block_type == "ShakingBlock")
		gameRoom.blocks.push(new game_objects.ShakingBlock(gameRoom, position, new THREE.Vector2(data.x2 * BLOCK_UNIT_SIZE, data.y2 * BLOCK_UNIT_SIZE), w, h));
	else {
		window.alert("wtf");
		// ??
	}
}

function create_spike(gameRoom, data) {
	let type = data.type;
	let x = data.x * BLOCK_UNIT_SIZE;
	let y = data.y * BLOCK_UNIT_SIZE;

	let position = new THREE.Vector2(x, y);
	
	if (type == "Spike") {
		let attached_to = data.attached_to;
		if (attached_to != null) {
			attached_to = gameRoom.blocks[attached_to];
			// window.alert(attached_to.type);
		}
		gameRoom.spikes.push(new game_objects.Spike(gameRoom, position, attached_to));
	}
	else if (type == "DeadlyBlock")
		gameRoom.spikes.push(new game_objects.DeadlyBlock(gameRoom, position, data.w * BLOCK_UNIT_SIZE, data.h * BLOCK_UNIT_SIZE))
	else {
		// ??
	}
}

function create_special_object(gameRoom, data) {
	gameRoom.special_objects.push(game_objects.get_special_object(gameRoom, data));
}

export function make_level(gameRoom, level_data) {
	let player_data = level_data.player;
	let blocks_data = level_data.blocks;
	let spikes_data = level_data.spikes;
	let special_objects_data = level_data.special_objects;
	let camera_triggers_data = level_data.camera_triggers;
	// player
	gameRoom.player = new game_objects.Player(gameRoom, new THREE.Vector2(player_data.x * BLOCK_UNIT_SIZE + 4, player_data.y * BLOCK_UNIT_SIZE), player_data.direction);

	// blocks
	gameRoom.blocks = [];
	for (const block of blocks_data) {
		create_block(gameRoom, block);
	}

	// spikes
	gameRoom.spikes = [];
	for (const spike of spikes_data) {
		create_spike(gameRoom, spike);
	}

	// special objects
	gameRoom.special_objects = [];
	for (const obj of special_objects_data) {
		create_special_object(gameRoom, obj);
	}

	// camera triggers
	gameRoom.camera_controller.triggers = [];
	for (var i = 0; i < camera_triggers_data.length; i += 13) {
		gameRoom.camera_controller.triggers.push(new CameraTrigger(
			camera_triggers_data[i + 0] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 1] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 2] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 3] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 4] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 5] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 6] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 7] * BLOCK_UNIT_SIZE,
			camera_triggers_data[i + 8],
			camera_triggers_data[i + 9],
			camera_triggers_data[i + 10],
			camera_triggers_data[i + 11],
			camera_triggers_data[i + 12],
		))
	}

	gameRoom.bgm_name = level_data.bgm_name;
	gameRoom.background = level_data.background;
}
