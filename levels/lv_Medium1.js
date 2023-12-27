import * as THREE from 'three';

const geometry = new THREE.PlaneGeometry(7200, 4800);
const textureLoader = new THREE.TextureLoader();
const BGTexture = textureLoader.load('textures/background_tutorial.png');
BGTexture.repeat.set(150, 100);
BGTexture.wrapS = THREE.RepeatWrapping;
BGTexture.wrapT = THREE.RepeatWrapping;
const BGMaterial = new THREE.MeshStandardMaterial({ map: BGTexture });

const BG = new THREE.Mesh(geometry, BGMaterial);
BG.position.x = 0;
BG.position.y = 0;
BG.position.z = -50;

export const lv_medium1 = {
	"player": {
		"x": 2,
		"y": 0,
		// "x": 138,
		// "y": 50,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -2, "w": 7, "h": 2 },
		{ "type": "ShakingBlock", "x": 6, "y": -2, "w": 3, "h": 2, "x2": 6, "y2": 6 },
		{ "type": "ShakingBlock", "x": 10, "y": 16, "w": 3, "h": 2, "x2": 10, "y2": 8 },
		{ "type": "ShakingBlock", "x": 3, "y": 20, "w": 6, "h": 2, "x2": 40, "y2": 16 },
		{ "type": "Block", "x": 48, "y": 10, "w": 2, "h": 18 },
		{ "type": "Block", "x": 30, "y": 28, "w": 30, "h": 2 },
		{ "type": "Block", "x": 53, "y": 8, "w": 1, "h": 7 },
		{ "type": "Block", "x": 74, "y": 8, "w": 9, "h": 2 }
	],
	"spikes": [
		{ "type": "DeadlyBlock", "x": -200, "y": -18, "w": 500, "h": 3 },
		{ "type": "Spike", "x": 54, "y": 15, "attached_to": null },
		{ "type": "Spike", "x": 54, "y": 13, "attached_to": null },
		{ "type": "Spike", "x": 54, "y": 11, "attached_to": null },
		{ "type": "Spike", "x": 54, "y": 9, "attached_to": null },
	],
	"special_objects": [
		{ "type": "DashRefresher", "x": 2.5, "y": 6, "refresh_count": 2 },
		{ "type": "BouncyBall", "x": 47.25, "y": 4.5 },
		{ "type": "GameGoal", "x": 78, "y": 14 },
	],
	"camera_triggers": [
		-2, 5, 0, 10, -100, 100, 2, 100, 150, 0.1, 5.0, 0.0, 15.0,
	],
	"bgm_name": "Medium",
	"background": BG,
};
