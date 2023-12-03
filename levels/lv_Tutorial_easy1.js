
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
		{ "type": "Spike", "x": 4, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 5, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 6, "y": -4, "attached_to": null },

		{ "type": "Spike", "x": 10, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 11, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 12, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 13, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 14, "y": -4, "attached_to": null },
		{ "type": "Spike", "x": 15, "y": -4, "attached_to": null }
	],
	"special_objects": [
		{ "type": "GameGoal", "x": 17.5, "y": 4 }
	],
	"camera_triggers": [
		0, 19, -4, 14, 9, 9, 4, 4, 125, 0.1, 5.0,
	]
};
