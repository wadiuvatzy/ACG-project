import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(4800, 4800);
const textureLoader = new THREE.TextureLoader();
const BGTexture = textureLoader.load('textures/background_tutorial.png');
BGTexture.repeat.set(100, 100);
BGTexture.wrapS = THREE.RepeatWrapping;
BGTexture.wrapT = THREE.RepeatWrapping;
const BGMaterial = new THREE.MeshStandardMaterial({ map: BGTexture });

const BG = new THREE.Mesh(geometry, BGMaterial);
BG.position.x = 0;
BG.position.y = 0;
BG.position.z = -50;

export const lv_easy2 = {
	"player": {
		"x": 0,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -2, "w": 6, "h": 2 },
		{ "type": "Block", "x": 9, "y": -4, "w": 60, "h": 2 },
		{ "type": "Block", "x": -15, "y": 3, "w": 10, "h": 1 },
		{ "type": "Block", "x": -11, "y": 7, "w": 4, "h": 1 },
		{ "type": "Block", "x": -1, "y": 11, "w": 3, "h": 1 },
		{ "type": "WeakBlock", "x": 12, "y": 1, "w": 1, "h": 12 },
		{ "type": "DropBlock", "x": 11, "y": 15, "w": 3, "h": 1 },
		{ "type": "ShakingBlock", "x": -7, "y": 7, "w": 3, "h": 1, "x2": 6, "y2": 7 },
	],
	"spikes": [
		{ "type": "Spike", "x": 10, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 12, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 14, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 16, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 18, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 20, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 22, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 24, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 26, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 28, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 30, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 32, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 34, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 36, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 38, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 40, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 42, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 44, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 46, "y": -2, "attached_to": null },
		{ "type": "DeadlyBlock", "x": -200, "y": -18, "w": 500, "h": 3 },

	],
	"special_objects": [
		{ "type": "GameGoal", "x": 65, "y": 0 },
		{ "type": "GameGoal", "x": -55, "y": 0 },
	],
	"camera_triggers": [
		-2, 5, 0, 10, -100, 100, 2, 100, 150, 0.1, 5.0, 0.0, 15.0,
	],
	"bgm_name": "Easy",
	"background": BG,
};
