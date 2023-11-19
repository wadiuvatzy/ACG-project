// Keyboard.js
// This file handles keyboard inputs.
// Need to call InitKeyboard() in the beginning.

const KeyCodes = {
	'Reset': 82, // r
	'Jump': 67, // c
	'Dash': 88, // x
	'Left': 37,
	'Right': 39,
	'Up': 38,
	'Down': 39
}

var KeyboardValue = {
	'ResetPressed': false,
	'JumpPressed': false,
	'Jump': false,
	'DashPressed': false,
	'Left': false,
	'Right': false,
	'Up': false,
	'Down': false
};

var KeyboardValueNew = {
	'ResetPressed': false,
	'JumpPressed': false,
	'Jump': false,
	'DashPressed': false,
	'Left': false,
	'Right': false,
	'Up': false,
	'Down': false
};

function getKeyboardValue() {
	return KeyboardValue;
}

// this function keeps the current state of the keyboard.
function KeyboardUpdate() {
	// copy
	for (var key in KeyboardValue) {
		KeyboardValue[key] = KeyboardValueNew[key];
	}
	// clear
	KeyboardValueNew.ResetPressed = false;
	KeyboardValueNew.JumpPressed = false;
	KeyboardValueNew.DashPressed = false;
}

function EventListenerKeyDown(event) {
	const keycode = event.keyCode;
	if (keycode == KeyCodes.Jump) {
		KeyboardValueNew.Jump = true;
		KeyboardValueNew.JumpPressed = true;
	}
	else if (keycode == KeyCodes.Dash) {
		KeyboardValueNew.DashPressed = true;
	}
	else if (keycode == KeyCodes.Left) {
		KeyboardValueNew.Left = true;
	}
	else if (keycode == KeyCodes.Right) {
		KeyboardValueNew.Right = true;
	}
	else if (keycode == KeyCodes.Up) {
		KeyboardValueNew.Up = true;
	}
	else if (keycode == KeyCodes.Down) {
		KeyboardValueNew.Down = true;
	}
}

function EventListenerKeyUp(event) {
	const keycode = event.keyCode;
	if (keycode == KeyCodes.Jump) {
		KeyboardValueNew.Jump = false;
	}
	else if (keycode == KeyCodes.Dash) {
		// Do nothing.
	}
	else if (keycode == KeyCodes.Left) {
		KeyboardValueNew.Left = false;
	}
	else if (keycode == KeyCodes.Right) {
		KeyboardValueNew.Right = false;
	}
	else if (keycode == KeyCodes.Up) {
		KeyboardValueNew.Up = false;
	}
	else if (keycode == KeyCodes.Down) {
		KeyboardValueNew.Down = false;
	}
}

function InitKeyboard() {
	window.addEventListener('keydown', EventListenerKeyDown);
	window.addEventListener('keyup', EventListenerKeyUp);
}

export { InitKeyboard, KeyboardUpdate, getKeyboardValue };