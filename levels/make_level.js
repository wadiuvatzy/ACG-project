import * as game_objects from '../objects';
import * as THREE from 'three';

function create_block(gameRoom, data) {
	let type = data[0];
	let x = data[1];
	let y = data[2];
	let w = data[3];
	let h = data[4];

	let position = new THREE.Vector2(x, y);

	if (type == "Block")
		gameRoom.blocks.push(new game_objects.Block(gameRoom, position, w, h));
	else if (type == "DropBlock")
		gameRoom.blocks.push(new game_objects.DropBlock(gameRoom, position, w, h));
	else if (type == "WeakBlock")
		gameRoom.blocks.push(new game_objects.WeakBlock(gameRoom, position, w, h));
	else {
		// ??
	}
}

function create_spike(gameRoom, data) {
	let type = data[0];
	let x = data[1];
	let y = data[2];
	let attached_to = data[3];

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
	gameRoom.player = new game_objects.Player(gameRoom, new THREE.Vector2(player_data.x, player_data.y), player_data.direction);

	// blocks
	for (const block in blocks_data) {
		create_block(gameRoom, block);
	}
	// spikes
	for (const spike in spikes_data) {
		create_spike(gameRoom, spike);
	}
	// special objects
	for (const obj in special_objects_data) {
		create_special_object(gameRoom, obj);
	}
}