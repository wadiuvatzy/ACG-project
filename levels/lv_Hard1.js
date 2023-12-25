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

export const lv_hard1 = {
	"player": {
		"x": 2,
		"y": 0,
		// "x": 138,
		// "y": 50,
		"direction": 1
	},
	"blocks": [
		// phase 1
		{ "type": "Block", "x": -2, "y": -2, "w": 7, "h": 2 },
		{ "type": "Block", "x": -5, "y": 10.25, "w": 4, "h": 2 },
		{ "type": "DropBlock", "x": 17, "y": 35, "w": 10, "h": 2 },
		{ "type": "DropBlock", "x": 47, "y": 31, "w": 14, "h": 2 },
		// phase 2
		{ "type": "Block", "x": 130, "y": 10, "w": 1, "h": 15 },
		// phase 3
		{ "type": "Block", "x": 147, "y": 42, "w": 10, "h": 2 },
		{ "type": "Block", "x": 195, "y": 42, "w": 20, "h": 2 },
		// end
		{ "type": "Block", "x": 290, "y": 23, "w": 20, "h": 10 },
		{ "type": "Block", "x": 310, "y": 23, "w": 2, "h": 30 },

		// together with spikes
		{ "type": "Block", "x": -29, "y": 17.5, "w": 2, "h": 16 },
		{ "type": "Block", "x": 87, "y": 32, "w": 2, "h": 10 },
		
	],
	"spikes": [
		// overall
		{ "type": "DeadlyBlock", "x": -100, "y": -20, "w": 800, "h": 10 },
		// phase 1
		// above the block
		{ "type": "Spike", "x": -4, "y": 16.5, "attached_to": null },
		{ "type": "Spike", "x": -4, "y": 18.5, "attached_to": null },
		{ "type": "Spike", "x": -2, "y": 19.5, "attached_to": null },
		{ "type": "Spike", "x": -4, "y": 20.5, "attached_to": null },
		// for the two balls on the left
		{ "type": "Spike", "x": -16, "y": 18.5, "attached_to": null },

		{ "type": "Spike", "x": -27, "y": 20, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 22, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 24, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 26, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 28, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 30, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 32, "attached_to": null },
		{ "type": "Spike", "x": -27, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": -29, "y": 34, "attached_to": null },

		{ "type": "Spike", "x": -25, "y": 27, "attached_to": null },
		{ "type": "Spike", "x": -23, "y": 32, "attached_to": null },
		{ "type": "Spike", "x": -21, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": -19, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": -17, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": -15, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": -13, "y": 36, "attached_to": null },

		// around the ring
		{ "type": "Spike", "x": -4, "y": 40.6, "attached_to": null },
		{ "type": "Spike", "x": -2, "y": 40.6, "attached_to": null },
		{ "type": "Spike", "x": -5.5, "y": 41.1, "attached_to": null },

		// after two ultras: on the walls
		{ "type": "Spike", "x": 87, "y": 34, "attached_to": null },
		{ "type": "Spike", "x": 87, "y": 36, "attached_to": null },
		{ "type": "Spike", "x": 87, "y": 38, "attached_to": null },
		{ "type": "Spike", "x": 87, "y": 40, "attached_to": null },
		{ "type": "Spike", "x": 87, "y": 42, "attached_to": null },

		{ "type": "Spike", "x": 130.5, "y": 25, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 27, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 29, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 31, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 33, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 35, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 37, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 39, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 41, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 43, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 45, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 47, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 49, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 51, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 53, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 55, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 57, "attached_to": null },
		{ "type": "Spike", "x": 130.5, "y": 59, "attached_to": null },
		// bounces on the right
		{ "type": "Spike", "x": 141, "y": 10, "attached_to": null },
		{ "type": "Spike", "x": 141, "y": 12, "attached_to": null },
		{ "type": "Spike", "x": 143, "y": 13, "attached_to": null },

		{ "type": "Spike", "x": 131, "y": 20, "attached_to": null },
		{ "type": "Spike", "x": 131, "y": 18, "attached_to": null },
		{ "type": "Spike", "x": 133, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 135, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 137, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 139, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 141, "y": 21, "attached_to": null },
		{ "type": "Spike", "x": 143, "y": 21, "attached_to": null },
	],
	"special_objects": [
		// phase 1
		{ "type": "DashRefresher", "x": 2.5, "y": 7, "refresh_count": 1 },
		{ "type": "BouncyBall", "x": -2, "y": 10 },
		{ "type": "BouncyBall", "x": 16, "y": 18 },
		{ "type": "BouncyBall", "x": -27, "y": 18.5 },
		{ "type": "BouncyBall", "x": -25, "y": 24.5 },
		{ "type": "BouncyBall", "x": -8, "y": 26 },
		{ "type": "BouncyBall", "x": -2, "y": 36 },
		{ "type": "BouncyBall", "x": -21, "y": 40.25 },
		{ "type": "AccelerationRing", "x": -4, "y": 44, "direction": 1 },
		// phase 2
		{ "type": "BouncyBall", "x": 130.5, "y": 13 },
		{ "type": "DashRefresher", "x": 131, "y": 6, "refresh_count": 2 },
		{ "type": "DashRefresher", "x": 131, "y": 7, "refresh_count": 2 },
		{ "type": "BouncyBall", "x": 140, "y": 7.5 },
		{ "type": "BouncyBall", "x": 148.5, "y": 16 },
		{ "type": "BouncyBall", "x": 138, "y": 23 },
		{ "type": "AccelerationRing", "x": 138, "y": 33, "direction": 0 },
		// phase 3
		{ "type": "BouncyBall", "x": 134, "y": 49 },
		{ "type": "AccelerationRing", "x": 167, "y": 47, "direction": 1 },
		// end
		{ "type": "GameGoal", "x": 300, "y": 37 },
	],
	"camera_triggers": [
		-2, 5, 0, 3, 0, 0, 8, 16, 140, 0.1, 5.0, 0.0, 15.0,
		-5, -3, 12, 16, -16, -4, 12, 40, 140, 0.1, 5.0, 0.0, 15.0,
		-4.5, -1, 41, 47, 0, 130, 8, 40, 155, 0.15, 5.0, 48.0, 15.0,
		127, 131, 0, 24, 136, 145, 8, 50, 140, 0.1, 5.0, 0.0, 15.0,
		135, 141, 32, 38, 144, 300, 8, 50, 150, 0.15, 5.0, 48.0, 15.0,
	],
	"bgm_name": "Hard",
	"background": BG,
};
