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

export const lv_Tutorial_hard2 = {
	"player": {
		"x": 3,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		// surrounding
		{ "type": "Block", "x": -2, "y": -2, "w": 2, "h": 23 },
		{ "type": "Block", "x": 9, "y": -2, "w": 2, "h": 12 },
		{ "type": "Block", "x": 11, "y": 2, "w": 32, "h": 2 },
		{ "type": "Block", "x": 0, "y": 19, "w": 30, "h": 2 },
		{ "type": "Block", "x": 28, "y": 21, "w": 2, "h": 10 },
		{ "type": "Block", "x": 28, "y": 29, "w": 20, "h": 2 },
		{ "type": "Block", "x": 41, "y": 4, "w": 2, "h": 15 },
		{ "type": "Block", "x": 48, "y": 20, "w": 2, "h": 11 },
		// phase 1
		{ "type": "Block", "x": 0, "y": -2, "w": 9, "h": 2 },
		{ "type": "Block", "x": 2, "y": 4.5, "w": 1, "h": 2 },
		{ "type": "Block", "x": 9, "y": 10, "w": 5, "h": 3 },
		// phase 2
		{ "type": "DropBlock", "x": 16, "y": 8, "w": 3, "h": 2 },
		{ "type": "Block", "x": 33, "y": 13, "w": 1, "h": 2 },
		{ "type": "Block", "x": 41, "y": 19, "w": 7, "h": 3 },
	],
	"spikes": [
		{ "type": "Spike", "x": 2.25, "y": 7, "attached_to": null },
		{ "type": "Spike", "x": 1.5, "y": 6, "attached_to": null },
		{ "type": "Spike", "x": 1.5, "y": 8, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 6, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 2, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 8, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 10, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 12, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 14, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 16, "attached_to": null },
		{ "type": "Spike", "x": 0, "y": 18, "attached_to": null },
		{ "type": "Spike", "x": 1, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 1, "y": 17, "attached_to": null },
		{ "type": "Spike", "x": 1, "y": 15, "attached_to": null },
		{ "type": "Spike", "x": 3, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 4.375, "y": 18, "attached_to": null },
		{ "type": "Spike", "x": 5.75, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 7.75, "y": 19, "attached_to": null },

		{ "type": "Spike", "x": 9, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 7, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 6, "y": 5, "attached_to": null },
		{ "type": "Spike", "x": 9, "y": 6, "attached_to": null },
		{ "type": "Spike", "x": 7, "y": 6, "attached_to": null },
		{ "type": "Spike", "x": 9, "y": 8, "attached_to": null },
		{ "type": "Spike", "x": 9, "y": 10, "attached_to": null },
		{ "type": "Spike", "x": 9, "y": 12.25, "attached_to": null },
		{ "type": "Spike", "x": 7.75, "y": 10.7, "attached_to": null },

		{ "type": "Spike", "x": 26, "y": 18.5, "attached_to": null },
		{ "type": "Spike", "x": 28, "y": 18.5, "attached_to": null },
		{ "type": "Spike", "x": 30, "y": 22, "attached_to": null },
		{ "type": "Spike", "x": 31, "y": 20.5, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 34, "y": 22, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 33.25, "y": 17, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 15, "attached_to": null },
		{ "type": "Spike", "x": 31.5, "y": 16.5, "attached_to": null },
		{ "type": "Spike", "x": 29, "y": 17, "attached_to": null },
		{ "type": "Spike", "x": 32.5, "y": 23, "attached_to": null },
		{ "type": "Spike", "x": 31, "y": 24, "attached_to": null },
		{ "type": "Spike", "x": 31, "y": 26, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 29, "attached_to": null },

		{ "type": "Spike", "x": 41, "y": 5, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 7, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 9, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 11, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 13, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 15, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 17, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": 19, "attached_to": null },
		{ "type": "Spike", "x": 40.25, "y": 20.5, "attached_to": null },

		{ "type": "Spike", "x": 39, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 37, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 35, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 31, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 29, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 27, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 25, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 23, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 21, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 19, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 17, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 15, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 13, "y": 4, "attached_to": null },
		{ "type": "Spike", "x": 11.5, "y": 5, "attached_to": null },
		{ "type": "Spike", "x": 11, "y": 7, "attached_to": null },
		{ "type": "Spike", "x": 11, "y": 9, "attached_to": null },

		{ "type": "Spike", "x": 16, "y": 7.5, "attached_to": 11 },
		{ "type": "Spike", "x": 19, "y": 7.5, "attached_to": 11 },
		{ "type": "Spike", "x": 17.5, "y": 8, "attached_to": 11 },

	],
	"special_objects": [
		{ "type": "DashRefresher", "x": 6, "y": 11.5, "refresh_count": 1 },
		{ "type": "DashRefresher", "x": 35.5, "y": 20, "refresh_count": 1 },
		{ "type": "GameGoal", "x": 45, "y": 26}
	],
	"camera_triggers": [
		0, 6, -4, 6, 3, 3, 4, 16, 125, 0.1, 5.0, 0.0, 0.0,
		10, 14, 0, 19, 10, 37, 10, 16, 125, 0.05, 5.0, 62.5, 12.0,
		14, 16, 0, 19, 10, 37, 10, 16, 125, 0.15, 5.0, 63, 12.0,
		33, 41, 13, 15, 28, 41, 10, 24, 125, 0.15, 5.0, 60.0, 14.5,
	],
	"bgm_name": "Tutorial",
	"background": BG,
};
