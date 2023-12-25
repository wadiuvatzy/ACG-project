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

export const lv_easy1 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -2, "w": 7, "h": 2 },
		{ "type": "Block", "x": -5, "y": 9, "w": 4, "h": 2 },
		{ "type": "Block", "x": 5, "y": -2, "w": 5, "h": 8 },
		{ "type": "ShakingBlock", "x": 4, "y": 14, "w": 5, "h": 2, "x2": 10, "y2": 14 },
		{ "type": "ShakingBlock", "x": 22, "y": 14, "w": 8, "h": 2, "x2": 16, "y2": 14 },
		{ "type": "WeakBlock", "x": 19, "y": 16, "w": 1, "h": 10 },
		{ "type": "DropBlock", "x": 34, "y": 10, "w": 4, "h": 2 },
		{ "type": "Block", "x": 48, "y": 8, "w": 4, "h": 2 },
		{ "type": "Block", "x": 66, "y": 5, "w": 6, "h": 2 },
	],
	"spikes": [
		{ "type": "DeadlyBlock", "x": -20, "y": -18, "w": 500, "h": 3 },
	],
	"special_objects": [
		{ "type": "BouncyBall", "x": 60, "y": 4 },
		{ "type": "GameGoal", "x": 69, "y": 10 },

	],
	"camera_triggers": [
		-2, 5, 0, 10, -100, 100, 2, 100, 150, 0.1, 5.0, 0.0, 15.0,
	],
	"bgm_name": "Easy",
	"background": BG,
};
