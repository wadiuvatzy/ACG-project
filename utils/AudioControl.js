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

var intro_loaded = false;

audioLoader.load('audio/intro.mp3', function (buffer) {
	bgm_intro.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(0.5);
	intro_loaded = true;
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
