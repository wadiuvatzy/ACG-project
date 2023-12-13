import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as utils from '../utils';
import * as game_objects from '../objects';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

class StartRoom {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

		this.current_level = 0;
		this.current_level_angle = 0;
		this.target_level_angle = 0;
		this.already_level_angle = 0;
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


		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 100;

		const loader = new THREE.TextureLoader();
		var texture = loader.load('../textures/3Deleste.png');
		var geometry = new THREE.PlaneGeometry(100, 35, 32);
		var material = new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0, transparent: true });
		var plane = new THREE.Mesh(geometry, material);
		plane.position.x = 0;
		plane.position.y = 50;
		plane.position.z = 0;
		this.scene.add(plane);

		texture = loader.load('../textures/select_levels.png');
		var geometry = new THREE.PlaneGeometry(122, 14, 32);
		var material = new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0, transparent: true });
		var plane = new THREE.Mesh(geometry, material);
		plane.position.x = 0;
		plane.position.y = -55;
		plane.position.z = 0;
		this.scene.add(plane);

		texture = loader.load('../textures/strawberry.png');
		var geometry = new THREE.PlaneGeometry(10, 10, 32);
		var material = new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0, transparent: true });
		this.strawberry_plane = new THREE.Mesh(geometry, material);
		this.strawberry_plane.position.x = 35;
		this.strawberry_plane.position.y = 52;
		this.strawberry_plane.position.z = 0;
		this.scene.add(this.strawberry_plane);
		this.time = 0;

		// create level textures
		this.level_textures = [];
		var temp = ['1', '2', '3', '4__'];
		for (var i = 0; i < 4; i++) {
			texture = loader.load(`../textures/level_entrance/${temp[i]}.png`);
			texture.encoding = THREE.sRGBEncoding;
			this.level_textures.push(texture);
		}
		this.level_radius = 18
		this.level_angles = []
		for (var i = 0; i < 4; i++) {
			this.level_angles.push(i * Math.PI / 2)
		}
		// create level boxes
		for (var i = 0; i < 4; i++) {
			var geometry = new THREE.PlaneGeometry(20, 20, 32);
			texture = this.level_textures[i]
			if (i == this.current_level) {
				material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
			}
			else {
				material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true });
			}
			var cube = new THREE.Mesh(geometry, material);
			cube.position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			cube.position.y = -30;
			cube.position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
			this.scene.add(cube);
			this.level_blocks.push(cube);
		}

		// background
		var geometry = new THREE.PlaneGeometry(480, 270, 32);
		// 预加载所有纹理
		this.textureLoader = new THREE.TextureLoader();
		this.background_textures = [];

		// 预加载所有纹理
		for (let i = 0; i < 18; i++) {
			let texture = this.textureLoader.load(`../textures/startroom_background/${i}.png`);
			texture.encoding = THREE.sRGBEncoding;
			this.background_textures.push(texture);
		}
		var material = new THREE.MeshBasicMaterial({ map: this.background_textures[0] })
		this.background_index = 0;
		this.background_plane = new THREE.Mesh(geometry, material);
		this.background_plane.position.x = 0;
		this.background_plane.position.y = 0;
		this.background_plane.position.z = -40;
		this.scene.add(this.background_plane);
		// this.scene.background = new THREE.TextureLoader().load('../textures/startroom_background/0.png');

	}
	reset() {

	}
	Step() {
		this.time += 1;
		this.strawberry_plane.position.z = 3 + Math.sin(this.time / 50) * 1.5;
		this.background_plane.position.x = Math.sin(this.time / 149) * 5;
		this.background_plane.position.y = Math.sin(this.time / 351) * 10;

		if (this.time % 12 == 0) {
			this.background_index = (this.background_index + 1) % 18;
			var material = new THREE.MeshBasicMaterial({ map: this.background_textures[this.background_index] })
			this.background_plane.material = material;
		}


		// move level blocks
		var keyboardValue = utils.getKeyboardValue();
		if (keyboardValue.Left) {
			if (this.press_timer == 0 || this.keyValue != 1) {
				this.current_level = (this.current_level + 3) % 4;
				this.target_level_angle += Math.PI / 2;
				this.keyValue = 1;
				this.press_timer = 0;
			}
			else if (this.press_timer == 11 && this.keyValue == 1) {
				this.current_level = (this.current_level + 3) % 4;
				this.target_level_angle += Math.PI / 2;
				this.press_timer = 0;
			}
			this.press_timer += 1;

		}
		else if (keyboardValue.Right) {
			if (this.press_timer == 0 || this.keyValue != 2) {
				this.current_level = (this.current_level + 1) % 4;
				this.target_level_angle -= Math.PI / 2;
				this.keyValue = 2;
				this.press_timer = 0;
			}
			else if (this.press_timer == 11 && this.keyValue == 2) {
				this.current_level = (this.current_level + 1) % 4;
				this.target_level_angle -= Math.PI / 2;
				this.press_timer = 0;
			}
			this.press_timer += 1;
		}
		else if (keyboardValue.Jump) {
			// TODO: load the level
			// window.alert("Level " + this.current_level);
			return this.current_level;
		}
		else {
			this.press_timer = 0;
		}
		// control the rotation of the level blocks
		var x = Math.PI / 10
		if (Math.abs(this.target_level_angle - this.current_level_angle) >= Math.pi / 2) {
			this.current_level_angle += x * Math.sign(this.target_level_angle - this.current_level_angle)
		}
		else {
			this.current_level_angle += x * Math.sin(this.target_level_angle - this.current_level_angle)
		}

		if (this.current_level_angle >= Math.PI / 2) {
			if (Math.abs(this.target_level_angle - this.current_level_angle) < Math.pi / 3) {
				this.current_level_angle = Math.PI / 2;
			}
		}
		if (this.current_level_angle <= -Math.PI / 2) {
			if (Math.abs(this.target_level_angle - this.current_level_angle) < Math.pi / 3) {
				this.current_level_angle = -Math.PI / 2;
			}
		}
		var step = this.current_level_angle - this.already_level_angle;

		if (this.current_level_angle >= Math.PI / 2) {
			this.current_level_angle -= Math.PI / 2;
			this.target_level_angle -= Math.PI / 2;
		}
		if (this.current_level_angle <= -Math.PI / 2) {
			this.current_level_angle += Math.PI / 2;
			this.target_level_angle += Math.PI / 2;
		}
		this.already_level_angle = this.current_level_angle;

		for (var i = 0; i < 4; i++) {
			this.level_angles[i] += step;
			var texture = this.level_textures[i];
			if (i == this.current_level) {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
			}
			else {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true });
			}
			this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			this.level_blocks[i].position.y = -30;
			this.level_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
		}

		return -1;
	}
	Render() {

	}
}

export default StartRoom;