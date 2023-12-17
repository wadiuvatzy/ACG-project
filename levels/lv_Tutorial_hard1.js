
export const lv_Tutorial_hard1 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		// phase 1
		{ "type": "Block", "x": -2, "y": -5, "w": 27, "h": 2 },
		{ "type": "Block", "x": 0, "y": -3, "w": 4, "h": 3 },
		{ "type": "Block", "x": 21, "y": -3, "w": 4, "h": 3 },
		// phase 2
		{ "type": "DropBlock", "x": 26, "y": -1, "w": 3, "h": 2 },
		{ "type": "DropBlock", "x": 44, "y": -3, "w": 3, "h": 2 },
		{ "type": "DropBlock", "x": 62, "y": -5, "w": 3, "h": 2 },
		{ "type": "Block", "x": 79, "y": -12, "w": 6, "h": 9 },
		// surrounding blocks
		{ "type": "Block", "x": -2, "y": -3, "w": 2, "h": 11 },
		{ "type": "Block", "x": 85, "y": -12, "w": 2, "h": 18 },
		{ "type": "Block", "x": 23, "y": -12, "w": 56, "h": 2 },
		{ "type": "Block", "x": 48, "y": 4, "w": 37, "h": 2 },
		{ "type": "Block", "x": 0, "y": 6, "w": 50, "h": 2 },
		{ "type": "Block", "x": 23, "y": -10, "w": 2, "h": 7 }
	],
	"spikes": [
		// phase 1
		{ "type": "Spike", "x": 4, "y": -2, "attached_to": null },
		{ "type": "Spike", "x": 5, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 7, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 9, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 11, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 13, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 15, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 17, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 19, "y": -3, "attached_to": null },
		{ "type": "Spike", "x": 21, "y": -3, "attached_to": null },
		// phase 2
		{ "type": "Spike", "x": 25, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 27, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 29, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 31, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 33, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 35, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 37, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 39, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 41, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 43, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 45, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 47, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 49, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 51, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 53, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 55, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 57, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 59, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 61, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 63, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 65, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 67, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 69, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 71, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 73, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 75, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 77, "y": -10, "attached_to": null },
		{ "type": "Spike", "x": 79, "y": -10, "attached_to": null },
		// two walls
		{ "type": "Spike", "x": 79, "y": -8, "attached_to": null },
		{ "type": "Spike", "x": 79, "y": -6, "attached_to": null },
		{ "type": "Spike", "x": 79, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 25, "y": -8, "attached_to": null },
		{ "type": "Spike", "x": 25, "y": -6, "attached_to": null },
		{ "type": "Spike", "x": 25, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 25, "y": -2, "attached_to": null },

	],
	"special_objects": [
		{ "type": "GameGoal", "x": 83, "y": 0 },
	],
	"camera_triggers": [
		0, 16, -2, 6, 10, 10, 3, 3, 125, 0.1, 5.0, 0.0, 0.0,
		16, 21, -2, 6, 22, 76, -20, 4, 125, 0.1, 5.0, 50.0, 12.0,
	],
	"bgm_name": "Tutorial",
};
