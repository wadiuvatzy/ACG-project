import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as utils from '../utils';
import * as game_objects from '../objects';

class StartRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		this.current_level = 0;
		this.level_blocks = [];
		this.create_scene();
		this.keyValue = null; // 1 for left, 2 for right
		this.press_timer = 0;
	}

	create_scene() {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.x = -20;
		directionalLight.position.y = 0;
		directionalLight.position.z = 20;
		this.scene.add(directionalLight);

		const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambientlight);

		// for debugging
		var points = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(new THREE.Vector3(0, 100, 0));
		points.push(new THREE.Vector3(100, 0, 0));
		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
		var line = new THREE.Line(geometry, material);
		this.scene.add(line);

		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 100;

		this.welcome_text = null;
		this.welcome_text_timer = 0;
		const loader = new FontLoader();
		loader.load( '../fonts/helvetiker_regular.typeface.json', function ( font ) {
			var geometry = new TextGeometry( 'Welcome!', {
				font: font,
				size: 20,
				height: 2,
				curveSegments: 3,
				bevelEnabled: true,
				bevelThickness: 2,
				bevelSize: 2,
				bevelSegments: 1
			} );
			geometry.computeBoundingBox();
			geometry.center();
			var material = new THREE.MeshStandardMaterial( { color: 0x00ffff } );
			this.welcome_text = new THREE.Mesh( geometry, material );
			this.scene.add( this.welcome_text );
		}.bind(this) );

		// create level boxes
		for (var i = 0; i < 3; i++) {
			var geometry = new THREE.BoxGeometry(20, 20, 20);
			var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
			var cube = new THREE.Mesh(geometry, material);
			cube.position.x = i * 30 - 30;
			cube.position.y = -30;
			cube.position.z = 0;
			this.scene.add(cube);
			this.level_blocks.push(cube);
		}

	}
	reset() {
		
	}
	Step() {
		// move welcome text
		this.welcome_text_timer += 1;
		this.welcome_text.position.x = 0;
		this.welcome_text.position.y = 50 + Math.sin(this.welcome_text_timer * 0.015) * 5;

		// move level blocks
		var keyboardValue = utils.getKeyboardValue();
		if (keyboardValue.Left) {
			if (this.keyValue != 1) {
				this.keyValue = 1;
				this.press_timer = 0;
			}
			else {
				this.press_timer += 1;
				if (this.press_timer > 5) {
					this.current_level = (this.current_level + 2) % 3;
					this.press_timer = 0;
				}
			}
		}
		if (keyboardValue.Right) {
			if (this.keyValue != 2) {
				this.keyValue = 2;
				this.press_timer = 0;
			}
			else {
				this.press_timer += 1;
				if (this.press_timer > 5) {
					this.current_level = (this.current_level + 1) % 3;
					this.press_timer = 0;
				}
			}
		}
		if (keyboardValue.Jump) {
			// TODO: load the level
			// window.alert("Level " + this.current_level);
			return this.current_level;
		}
		for (var i = 0; i < 3; i++) {
			if (i == this.current_level) {
				this.level_blocks[i].position.z = 10;
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
			}
			else {
				this.level_blocks[i].position.z = 0;
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
			}
		}

		return -1;
	}
	Render() {

	}
}

export default StartRoom;