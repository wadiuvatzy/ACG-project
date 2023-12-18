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
		this.current_second_level = 0;
		this.current_level_angle = 0;
		this.target_level_angle = 0;
		this.already_level_angle = 0;
		this.level_blocks = [];
		this.level_word_blocks = [];
		this.second_blocks = [];
		this.levels_each = [6, 2, 3, 4];
		this.create_scene();
		this.init_second_blocks();
		// this.reset_second_blocks();
		this.keyValue = null; // 1 for left, 2 for right
		this.press_timer = 0;
		this.jump_continue_from_first_to_second = false;
		this.started = false;
		this.zero_last_jump = false;
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
		this.select_level_plane = new THREE.Mesh(geometry, material);
		this.select_level_plane.position.x = 0;
		this.select_level_plane.position.y = -55;
		this.select_level_plane.position.z = 500;
		this.scene.add(this.select_level_plane);

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
		this.level_worlds = []
		var temp = ['1', '2', '3', '4__'];
		var temp_words = ['tutorial', 'easy', 'medium', 'hard']
		for (var i = 0; i < 4; i++) {
			texture = loader.load(`../textures/level_entrance/${temp[i]}.png`);
			texture.encoding = THREE.sRGBEncoding;
			this.level_textures.push(texture);
			texture = loader.load(`../textures/level_entrance/${temp_words[i]}.png`);
			texture.encoding = THREE.sRGBEncoding;
			this.level_worlds.push(texture);
		}
		this.level_radius = 18
		this.level_angles = []
		for (var i = 0; i < 4; i++) {
			this.level_angles.push(i * Math.PI / 2)
		}
		// create level boxes
		for (var i = 0; i < 4; i++) {
			var word_geometry = new THREE.PlaneGeometry(16, 8, 32);
			var word_material;
			var word_texture = this.level_worlds[i];
			var geometry = new THREE.PlaneGeometry(20, 20, 32);
			texture = this.level_textures[i]
			if (i == this.current_level) {
				material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
				word_material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true, emissiveMap: word_texture, emissiveIntensity: 1.0, emissive: 0xffffff });
			}
			else {
				material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true });
				word_material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true });
			}
			var cube = new THREE.Mesh(geometry, material);
			cube.position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			cube.position.y = -20;
			cube.position.z = 500 + this.level_radius * Math.cos(this.level_angles[i])
			this.scene.add(cube);
			this.level_blocks.push(cube);
			var word_cube = new THREE.Mesh(word_geometry, word_material);
			word_cube.position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			word_cube.position.y = -31;
			word_cube.position.z = 500 + this.level_radius * Math.cos(this.level_angles[i])
			this.scene.add(word_cube);
			this.level_word_blocks.push(word_cube);
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

		// load the start sentence
		texture = loader.load('../textures/start_sentence.png');
		var geometry = new THREE.PlaneGeometry(138, 24, 32);
		var material = new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0, transparent: true, emissiveMap: word_texture, emissiveIntensity: 1.0, emissive: 0xffffff });
		this.start_plane = new THREE.Mesh(geometry, material);
		this.start_plane.position.x = 0;
		this.start_plane.position.y = -10;
		this.start_plane.position.z = 0;
		this.scene.add(this.start_plane);

	}
	reset() {
		for (var i = 0; i < 4; i++) {
			this.level_angles[i] = (i - this.current_level) * Math.PI / 2
		}
		for (var i = 0; i < 4; i++) {
			var texture = this.level_textures[i];
			var word_texture = this.level_worlds[i];
			if (i == this.current_level) {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
				this.level_word_blocks[i].material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true, emissiveMap: word_texture, emissiveIntensity: 1.0, emissive: 0xffffff });
			}
			else {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true });
				this.level_word_blocks[i].material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true });
			}
			this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			this.level_blocks[i].position.y = -20;
			this.level_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
			this.level_word_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			this.level_word_blocks[i].position.y = -31;
			this.level_word_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
		}
		this.current_level_angle = 0;
		this.target_level_angle = 0;
		this.already_level_angle = 0;
	}
	init_second_blocks() {
		const loader = new THREE.TextureLoader();
		for (var i = 0; i < 4; i++) {
			var temp = [];
			var mid = (this.levels_each[i] + 1) / 2;
			for (var j = 0; j < this.levels_each[i]; j++) {
				// TODO: load the level
				var geometry = new THREE.PlaneGeometry(18, 30, 32);
				var texture = loader.load(`../textures/level_entrance/numbers/${j + 1}.png`);
				var material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
				var cube = new THREE.Mesh(geometry, material);
				cube.position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				cube.position.y = -30;
				cube.position.z = 0;
				temp.push(cube);
			}
			this.second_blocks.push(temp);
		}

		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < this.levels_each[i]; j++) {
				this.scene.add(this.second_blocks[i][j]);
			}
		}
		this.reset_second_blocks();
	}
	reset_second_blocks() {
		// throw all the second blocks away
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < this.levels_each[i]; j++) {
				this.second_blocks[i][j].position.z = 500; // throw it away
			}
		}
	}
	rotate_first_blocks() {
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
			var word_texture = this.level_worlds[i];
			if (i == this.current_level) {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true, emissiveMap: texture, emissiveIntensity: 1.0, emissive: 0xffffff });
				this.level_word_blocks[i].material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true, emissiveMap: word_texture, emissiveIntensity: 1.0, emissive: 0xffffff });
			}
			else {
				this.level_blocks[i].material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.8, transparent: true });
				this.level_word_blocks[i].material = new THREE.MeshStandardMaterial({ map: word_texture, alphaTest: 0.8, transparent: true });
			}
			this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			this.level_blocks[i].position.y = -20;
			this.level_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
			this.level_word_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
			this.level_word_blocks[i].position.y = -31;
			this.level_word_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
		}

	}
	move_background() {
		this.time += 1;
		this.strawberry_plane.position.z = 3 + Math.sin(this.time / 50) * 1.5;
		this.background_plane.position.x = Math.sin(this.time / 149) * 5;
		this.background_plane.position.y = Math.sin(this.time / 351) * 10;

		if (this.time % 12 == 0) {
			this.background_index = (this.background_index + 1) % 18;
			var material = new THREE.MeshBasicMaterial({ map: this.background_textures[this.background_index] })
			this.background_plane.material = material;
		}
	}
	ZeroStep() {
		this.move_background();
		var keyboardValue = utils.getKeyboardValue();
		if (this.zero_last_jump == true && !keyboardValue.Jump) {
			this.started = true;
			utils.play_music("Intro");
			this.start_plane.position.z = 500;
			this.select_level_plane.position.z = 0;
		}
		this.zero_last_jump = keyboardValue.Jump;

	}
	Step() {
		if (!this.started) {
			this.ZeroStep();
			return -1;
		}

		this.move_background();

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
			this.jump_continue_from_first_to_second = true;
			return this.current_level;
		}
		else {
			this.press_timer = 0;
		}
		// control the rotation of the level blocks
		this.rotate_first_blocks();
		return -1;
	}
	SecondStep() {
		this.time += 1;
		this.strawberry_plane.position.z = 3 + Math.sin(this.time / 50) * 1.5;
		this.background_plane.position.x = Math.sin(this.time / 149) * 5;
		this.background_plane.position.y = Math.sin(this.time / 351) * 10;

		if (this.time % 12 == 0) {
			this.background_index = (this.background_index + 1) % 18;
			var material = new THREE.MeshBasicMaterial({ map: this.background_textures[this.background_index] })
			this.background_plane.material = material;
		}
		// put the first level up, others disappear
		for (var i = 0; i < 4; i++) {
			this.level_angles[i] = i * Math.PI / 2 + Math.PI / 2 * this.current_level;
		}
		for (var i = 0; i < 4; i++) {
			if (i == this.current_level) {
				this.level_blocks[i].material.emissiveIntensity = 1.0;
				this.level_word_blocks[i].material.emissiveIntensity = 1.0;
				this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				this.level_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
				this.level_word_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				this.level_word_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
				this.level_blocks[i].position.y = 10;
				this.level_word_blocks[i].position.y = -1;
			}
			else {
				this.level_blocks[i].material.emissiveIntensity = 0.0;
				this.level_word_blocks[i].material.emissiveIntensity = 0.0;
				this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				this.level_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				this.level_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
				this.level_word_blocks[i].position.x = 0 + 2 * this.level_radius * Math.sin(this.level_angles[i])
				this.level_word_blocks[i].position.z = 0 + this.level_radius * Math.cos(this.level_angles[i])
				this.level_blocks[i].position.z = 500; // throw it away
				this.level_word_blocks[i].position.z = 500; // throw it away
			}
		}
		var num_blocks = this.levels_each[this.current_level];
		var keyboardValue = utils.getKeyboardValue();
		if (keyboardValue.PausePressed) {
			this.reset();
			return -2;
		} if (keyboardValue.Left) {
			if (this.press_timer == 0 || this.keyValue != 1) {
				this.current_second_level = (this.current_second_level + num_blocks - 1) % num_blocks;
				this.keyValue = 1;
				this.press_timer = 0;
			}
			else if (this.press_timer == 11 && this.keyValue == 1) {
				this.current_second_level = (this.current_second_level + num_blocks - 1) % num_blocks;
				this.press_timer = 0;
			}
			this.press_timer += 1;
		}
		else if (keyboardValue.Right) {
			if (this.press_timer == 0 || this.keyValue != 2) {
				this.current_second_level = (this.current_second_level + 1) % num_blocks;
				this.keyValue = 2;
				this.press_timer = 0;
			}
			else if (this.press_timer == 11 && this.keyValue == 2) {
				this.current_second_level = (this.current_second_level + 1) % num_blocks;
				this.target_level_angle -= Math.PI / 2;
				this.press_timer = 0;
			}
			this.press_timer += 1;
		}
		else if (keyboardValue.Jump) {
			if (this.jump_continue_from_first_to_second) {
				this.jump_continue_from_first_to_second = true;
			} else {
				this.reset_second_blocks();
				return this.current_second_level;
			}
		}
		else {
			this.jump_continue_from_first_to_second = false;
			this.press_timer = 0;
		}

		var mid = (this.second_blocks[this.current_level].length + 1) / 2;
		// visualize the second level blocks
		for (var j = 0; j < this.second_blocks[this.current_level].length; j++) {
			this.second_blocks[this.current_level][j].position.x = (j + 1 - mid) * 25
			this.second_blocks[this.current_level][j].position.y = -20;
			this.second_blocks[this.current_level][j].position.z = 0;
			this.second_blocks[this.current_level][j].material.emissiveIntensity = 0.0;
			if (j == this.current_second_level) {
				this.second_blocks[this.current_level][j].material.emissiveIntensity = 1.0;
			}
		}

		return -1;
	}

	Render() {
	}
}

export default StartRoom;