import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

class StartRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.init_debug();
	}

	init_debug() {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.x = -20;
		directionalLight.position.y = 0;
		directionalLight.position.z = 20;
		this.scene.add(directionalLight);

		const ambientlight = new THREE.AmbientLight(0x404040); // soft white light
		this.scene.add(ambientlight);

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
	}
	reset() {
		
	}
	Step() {
		// move welcome text
		this.welcome_text_timer += 1;
		this.welcome_text.position.x = 0;
		this.welcome_text.position.y = 50 + Math.sin(this.welcome_text_timer * 0.015) * 5;

	}
	Render() {

	}
}

export default StartRoom;