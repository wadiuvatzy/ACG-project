// Keyboard.js
// This file handles keyboard inputs.
// Need to call InitKeyboard() in the beginning.

const KeyCodes = {
	'Reset': 'KeyR', // r
	'Jump': 'KeyC', // c
	'Dash': 'KeyX', // x
	'Left': 'ArrowLeft',
	'Right': 'ArrowRight',
	'Up': 'ArrowUp',
	'Down': 'ArrowDown'
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
	const code = event.code;
	if (code == KeyCodes.Jump) {
		KeyboardValueNew.Jump = true;
		KeyboardValueNew.JumpPressed = true;
	}
	else if (code == KeyCodes.Dash) {
		KeyboardValueNew.DashPressed = true;
	}
	else if (code == KeyCodes.Left) {
		KeyboardValueNew.Left = true;
	}
	else if (code == KeyCodes.Right) {
		KeyboardValueNew.Right = true;
	}
	else if (code == KeyCodes.Up) {
		KeyboardValueNew.Up = true;
	}
	else if (code == KeyCodes.Down) {
		KeyboardValueNew.Down = true;
	}
}

function EventListenerKeyUp(event) {
	const code = event.code;
	if (code == KeyCodes.Jump) {
		KeyboardValueNew.Jump = false;
	}
	else if (code == KeyCodes.Dash) {
		// Do nothing.
	}
	else if (code == KeyCodes.Left) {
		KeyboardValueNew.Left = false;
	}
	else if (code == KeyCodes.Right) {
		KeyboardValueNew.Right = false;
	}
	else if (code == KeyCodes.Up) {
		KeyboardValueNew.Up = false;
	}
	else if (code == KeyCodes.Down) {
		KeyboardValueNew.Down = false;
	}
}

function InitKeyboard() {
	window.addEventListener('keydown', EventListenerKeyDown);
	window.addEventListener('keyup', EventListenerKeyUp);
}

export { InitKeyboard, KeyboardUpdate, getKeyboardValue };