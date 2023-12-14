import * as THREE from 'three';


// direction is a THREE.Vector2
export function get_compress_matrix(direction, factor, keep_size) {
	let norm = direction.length();
	direction.x /= norm;
	direction.y /= norm;
	let side_factor = 1;
	if (keep_size)
		side_factor = Math.sqrt(1 / factor);
	let m = new THREE.Matrix4();
	m.set(
		direction.x * direction.x * factor + direction.y * direction.y * side_factor, direction.x * direction.y * (factor - side_factor), 0, 0,
		direction.x * direction.y * (factor - side_factor), direction.y * direction.y * factor + direction.x * direction.x * side_factor, 0, 0,
		0, 0, side_factor, 0,
		0, 0, 0, 1
	);
	return m;
}