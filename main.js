import * as THREE from 'three';

const FPS = 60;
var now;
var then = Date.now();
var interval = 1000 / FPS;
var delta;

function animate() {
	requestAnimationFrame(lockingFPS);
	now = Date.now();
	delta = now - then;
	if (delta >= interval) {
		then = now - (delta % interval);
		// TODO: main loop here.
	}
}

animate();