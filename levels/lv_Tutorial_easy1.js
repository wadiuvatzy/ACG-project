import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(4800, 4800);
const textureLoader = new THREE.TextureLoader();
const BGTexture = textureLoader.load('textures/background_tutorial.png');
BGTexture.repeat.set(100, 100);
BGTexture.wrapS = THREE.RepeatWrapping;
BGTexture.wrapT = THREE.RepeatWrapping;
const BGMaterial = new THREE.MeshStandardMaterial({ map: BGTexture });

const BG = new THREE.Mesh(geometry, BGMaterial);



export const lv_Tutorial_easy1 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -6, "w": 2, "h": 20 },
		{ "type": "Block", "x": 0, "y": -4, "w": 4, "h": 4 },
		{ "type": "Block", "x": 0, "y": -6, "w": 15, "h": 2 },
		{ "type": "Block", "x": 6, "y": -4, "w": 4, "h": 4 },
		{ "type": "Block", "x": 15, "y": -6, "w": 4, "h": 8 },
		{ "type": "Block", "x": 19, "y": -6, "w": 2, "h": 20 },
		{ "type": "Block", "x": -2, "y": 14, "w": 23, "h": 2}
	],
	"spikes": [
		{ "type": "Spike", "x": 4.25, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 5.75, "y": -4, "attached_to": null },

		{ "type": "Spike", "x": 11, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 12.5, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 14, "y": -4, "attached_to": null },
	],
	"special_objects": [
		{ "type": "GameGoal", "x": 17.5, "y": 4 }
	],
	"camera_triggers": [
		0, 19, -4, 14, 9, 9, 4, 4, 125, 0.1, 5.0, 0.0, 0.0
	],
	"bgm_name": "Tutorial",
};
