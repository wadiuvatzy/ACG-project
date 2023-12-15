
export const lv_Tutorial_hard3 = {
	"player": {
		"x": 2,
		"y": 0,
		"direction": 1
	},
	"blocks": [
		// phase 1
		{ "type": "Block", "x": 0, "y": -8, "w": 6, "h": 8 },
		{ "type": "Block", "x": 16, "y": -8, "w": 6, "h": 4 },
		{ "type": "Block", "x": 45, "y": -8, "w": 6, "h": 7 },
		{ "type": "Block", "x": 18, "y": 1, "w": 2, "h": 8 },
		// phase 2
		{ "type": "Block", "x": 61, "y": -7, "w": 6, "h": 2 },
		{ "type": "Block", "x": 80, "y": -11, "w": 9, "h": 2 },
		{ "type": "Block", "x": 105, "y": -15, "w": 14, "h": 2 },
		{ "type": "Block", "x": 164, "y": -20, "w": 16, "h": 6 },
	],
	"spikes": [
		{ "type": "DeadlyBlock", "x": -20, "y": -60, "w": 70, "h": 50 },
		{ "type": "DeadlyBlock", "x": 50, "y": -60, "w": 30, "h": 40 },
		{ "type": "DeadlyBlock", "x": 80, "y": -60, "w": 120, "h": 30 },
	],
	"special_objects": [
		{ "type": "GameGoal", "x": 172, "y": -10 }
	],
	"camera_triggers": [
		0, 5, -4, 8, 18, 30, 4, 4, 155, 0.1, 5.0, 0.0, 18.0,
		44, 48, -4, 8, 50, 180, -30, 5, 180, 0.05, 1.2, 48.0, 26.0,
		52, 55, -24, 8, 50, 180, -30, 5, 180, 0.175, 5.0, 64.0, 28.0,
		160, 180, -24, 8, 170, 180, -10, -10, 150, 0.05, 1.5, 0.0, 32.0,
	]
};
