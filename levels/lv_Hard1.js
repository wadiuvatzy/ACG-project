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

export const lv_hard1 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		{ "type": "Block", "x": -2, "y": -2, "w": 7, "h": 2 },
		{ "type": "Block", "x": -5, "y": 10.25, "w": 4, "h": 2 },
		{ "type": "Block", "x": 15, "y": 36, "w": 10, "h": 2},
	],
	"spikes": [
		
	],
	"special_objects": [
		{ "type": "DashRefresher", "x": 2.5, "y": 7, "refresh_count": 1 },
		{ "type": "BouncyBall", "x": -2, "y": 10 },
		{ "type": "BouncyBall", "x": 16, "y": 18 },
		{ "type": "BouncyBall", "x": -27, "y": 18.5 },
		{ "type": "BouncyBall", "x": -25, "y": 24.5 },
		{ "type": "BouncyBall", "x": -8, "y": 26 },
		{ "type": "BouncyBall", "x": -2, "y": 36 },
		{ "type": "BouncyBall", "x": -21, "y": 40 },
		{ "type": "AccelerationRing", "x": -3, "y": 44, "direction": 1 },
	],
	"camera_triggers": [
		-2, 5, 0, 10, -100, 100, -100, 100, 150, 0.1, 5.0, 0.0, 15.0,
	],
	"bgm_name": "Hard",
	"background": BG,
};
