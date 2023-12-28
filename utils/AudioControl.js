import * as THREE from 'three';


const listener = new THREE.AudioListener();

const audioLoader = new THREE.AudioLoader();

// init all bgm
// load a sound and set it as the Audio object's buffer

const bgm_intro = new THREE.Audio(listener);
const bgm_tutorial = new THREE.Audio(listener);
const bgm_easy = new THREE.Audio(listener);
const bgm_medium = new THREE.Audio(listener);
const bgm_hard = new THREE.Audio(listener);

export var intro_loaded = false;

const introPromise = new Promise((resolve) => {
	audioLoader.load('audio/intro.mp3', function (buffer) {
		bgm_intro.setBuffer(buffer);
		bgm_intro.setLoop(true);
		bgm_intro.setVolume(0.5);
		intro_loaded = true;
		resolve();
	});
});
audioLoader.load('audio/tutorial.mp3', function (buffer) {
	bgm_tutorial.setBuffer(buffer);
	bgm_tutorial.setLoop(true);
	bgm_tutorial.setVolume(0.5);
});
audioLoader.load('audio/easy.mp3', function (buffer) {
	bgm_easy.setBuffer(buffer);
	bgm_easy.setLoop(true);
	bgm_easy.setVolume(0.5);
});
audioLoader.load('audio/medium.mp3', function (buffer) {
	bgm_medium.setBuffer(buffer);
	bgm_medium.setLoop(true);
	bgm_medium.setVolume(0.5);
});
audioLoader.load('audio/hard.mp3', function (buffer) {
	bgm_hard.setBuffer(buffer);
	bgm_hard.setLoop(true);
	bgm_hard.setVolume(0.5);
});

const BGM = {
	"Intro": bgm_intro,
	"Tutorial": bgm_tutorial,
	"Easy": bgm_easy,
	"Medium": bgm_medium,
	"Hard": bgm_hard,
}


var current_bgm = "None";
export async function play_music(music_id) {
	if (!intro_loaded) {
		// Wait for the intro to be loaded
		await introPromise;
	}
	if (current_bgm != music_id) {
		// window.alert("play music: " + music_id);
		if (current_bgm != "None")
			BGM[current_bgm].stop();
		current_bgm = music_id;
		BGM[current_bgm].autoplay = true;
		BGM[current_bgm].play();
	}
}


// init all sound effects.

const Effects = {
	"jump": [],
	"dash": [],
	"pumber": [],
	"refresh": [],
	"crystal": [],
	// TODO
	"break": [],
	"landing": [],
	"weak": [],
};
const EffectsIter = {
	"jump": 0,
	"dash": 0,
	"pumber": 0,
	"refresh": 0,
	"crystal": 0,
	"break": 0,
	"landing": 0,
	"weak": 0,
};

const MAX_EFFECTS = 5;

audioLoader.load('audio/effects/jump.mp3', function (buffer) {
	for (var i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.jump.push(audio);
	}
});
audioLoader.load('audio/effects/dash.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.dash.push(audio);
	}
});
audioLoader.load('audio/effects/pumber.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.pumber.push(audio);
	}
});
audioLoader.load('audio/effects/crystal.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.crystal.push(audio);
	}
});
audioLoader.load('audio/effects/refresh.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.refresh.push(audio);
	}
});
audioLoader.load('audio/effects/break.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.break.push(audio);
	}
	window.alert("success?");
});
audioLoader.load('audio/effects/landing.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.landing.push(audio);
	}
	window.alert("success??");
});
audioLoader.load('audio/effects/weak.mp3', function (buffer) {
	for (let i = 0; i < MAX_EFFECTS; i++) {
		const audio = new THREE.Audio(listener);
		audio.setBuffer(buffer);
		audio.setLoop(false);
		audio.setVolume(0.5);
		Effects.weak.push(audio);
	}
	window.alert("success???");
});

export function play_effect(effect_id, volume = 0.5) {
	let audio = Effects[effect_id][EffectsIter[effect_id]];
	if (audio.isPlaying)
		audio.stop();
	audio.setVolume(volume);
	audio.play();
	EffectsIter[effect_id] = EffectsIter[effect_id] + 1;
	if (EffectsIter[effect_id] >= MAX_EFFECTS)
		EffectsIter[effect_id] -= MAX_EFFECTS;
}