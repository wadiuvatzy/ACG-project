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

export const lv_Tutorial_easy2 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -2, "w": 2, "h": 20 },
		{ "type": "Block", "x": 0, "y": -2, "w": 12, "h": 2 },
		{ "type": "Block", "x": 4, "y": 0, "w": 8, "h": 10 },
		{ "type": "Block", "x": 12, "y": -2, "w": 2, "h": 20 },
		{ "type": "Block", "x": 0, "y": 16, "w": 12, "h": 2 }
	],
	"spikes": [

	],
	"special_objects": [
		{ "type": "GameGoal", "x": 10, "y": 12 }
	],
	"camera_triggers": [
		0, 8, 0, 9, 2, 4, 2, 10, 60, 0.1, 1.0, 0.0, 15.0,
		0, 12, 9, 16, 2, 12, 10, 12, 90, 0.1, 1.0, 0.0, 0.0,
	],
	"bgm_name": "Tutorial",
	"background": BG,
};
