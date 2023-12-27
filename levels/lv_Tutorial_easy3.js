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

export const lv_Tutorial_easy3 = {
	"player": {
		"x": 2,
		"y": 6,
		"direction": 1
	},
	"blocks": [
		// borders
		{ "type": "Block", "x": -2, "y": -2, "w": 2, "h": 40 },
		{ "type": "Block", "x": 0, "y": -2, "w": 54, "h": 2 },
		{ "type": "Block", "x": 54, "y": -2, "w": 2, "h": 40 },
		{ "type": "Block", "x": 0, "y": 36, "w": 54, "h": 2 },

		// surrounding the player
		{ "type": "Block", "x": 0, "y": 0, "w": 6, "h": 6},
		{ "type": "Block", "x": 0, "y": 12, "w": 6, "h": 12 },
		{ "type": "WeakBlock", "x": 4, "y": 6, "w": 2, "h": 6 },

		// moving blocks
		{ "type": "ShakingBlock", "x": 6, "y": 4, "w": 4, "h": 2, "x2": 14, "y2": 4 },
		{ "type": "ShakingBlock", "x": 32, "y": 4, "w": 4, "h": 2, "x2": 24, "y2": 4 },
		{ "type": "Block", "x": 36, "y": 0, "w": 8, "h": 6 },
		{ "type": "DropBlock", "x": 44, "y": 4, "w": 2, "h": 2 },
		{ "type": "DropBlock", "x": 46, "y": 4, "w": 2, "h": 2 },
		{ "type": "DropBlock", "x": 48, "y": 4, "w": 2, "h": 2 },
		{ "type": "ShakingBlock", "x": 50, "y": 3, "w": 3, "h": 2, "x2": 50, "y2": 14 },

		// above
		{ "type": "Block", "x": 6, "y": 16, "w": 42, "h": 2 },
		{ "type": "Block", "x": 46, "y": 18, "w": 2, "h": 2 },
		{ "type": "Block", "x": 24, "y": 18, "w": 6, "h": 6 },
	],
	"spikes": [
		{ "type": "DeadlyBlock", "x": 6, "y": 0, "w": 30, "h": 3 },
		{ "type": "DeadlyBlock", "x": 44, "y": 0, "w": 10, "h": 3 },
		{ "type": "DeadlyBlock", "x": 6, "y": 18, "w": 18, "h": 2 },
		{ "type": "DeadlyBlock", "x": 30, "y": 18, "w": 16, "h": 2 },
	],
	"special_objects": [
		{ "type": "GameGoal", "x": 3, "y": 28 },
		{ "type": "DashRefresher", "x": 22, "y": 8, "refresh_count": 1 },
		{ "type": "BouncyBall", "x": 44, "y": 24 },
		{ "type": "DashRefresher", "x": 22.5, "y": 26, "refresh_count": 2 },
		{ "type": "DashRefresher", "x": 22.5, "y": 29, "refresh_count": 2 },
		{ "type": "DashRefresher", "x": 22.5, "y": 32, "refresh_count": 2 },
	],
	"camera_triggers": [
		// left, right, low, high,
		// border_left, border_right, border_low, border_high,
		// z, xy_gamma, z_velocity, player_offset_x, player_offset_y
		0, 36, 0, 18, 9, 45, 9, 9, 150, 0.1, 6.0, 0.0, 6.0,
		36, 54, 0, 18, 44, 48, 9, 27, 150, 0.1, 6.0, 0.0, 6.0,
		28, 54, 24, 36, 34, 42, 30, 34, 150, 0.13, 6.0, 0.0, 6.0,
		0, 28, 18, 36, 6, 20, 24, 24, 150, 0.15, 8.0, 0.0, 6.0
	],
	"bgm_name": "Tutorial",
	"background": BG,
};
