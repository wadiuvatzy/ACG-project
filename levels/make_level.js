
import * as game_objects from '../objects';
import * as THREE from 'three';
import { BLOCK_UNIT_SIZE } from '../objects/Blocks';

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
	else {
		window.alert("wtf");
		// ??
	}
}

function create_spike(gameRoom, data) {
	let type = data.type;
	let x = data.x * BLOCK_UNIT_SIZE;
	let y = data.y * BLOCK_UNIT_SIZE;
	let attached_to = data.attached_to;

	let position = new THREE.Vector2(x, y);
	if (attached_to != null)
		attached_to = gameRoom.blocks[attached_to];

	if (type == "Spike")
		gameRoom.spikes.push(new game_objects.Spike(gameRoom, position, attached_to));
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
}
