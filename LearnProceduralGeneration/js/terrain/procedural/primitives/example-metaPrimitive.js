import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { precomputeSpectralWeights, fBm, falloff } from 'js/libs/noiselib.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

state = {
	scene: null,
	renderer: null,
	camera: null,
	width: 800,
	height: 600,
	object: null,
	controls: null,
	gridRes: 256,
	terrainSize: 10,
	perlin: null,
	spectralWeights: null,
	canvasName: "MetaPrimitive",
}
stateGUI = {
	PrimitiveType: 1,

	Radius: 3.5,
	Frequency: 2.0,
	Amplitude: 0.75,
}
var state;
var stateGUI;

function dunePrimitive(x, y) {
	let n = 0.0; //fBm(x, y, state.perlin, 0.5, 0.5, 2, 0); 
	let h = stateGUI.Amplitude * (1.0 - Math.abs(Math.cos((x + n) * stateGUI.Frequency)));
	//let h = stateGUI.Amplitude * (Math.cos((x + n) * stateGUI.Frequency));
	return h;
}

function sharpFalloff(d) {
	if (d > 3.15 * stateGUI.Radius)
		return 0.0;
	return stateGUI.Amplitude * (1.0 - Math.abs(Math.cos(d / stateGUI.Radius)));
}

function craterPrimitive(x, y) {
	let d = (x * x + y * y);
	let w = sharpFalloff(d);
	let n = fBm(x, y, state.perlin, 0.8, 1.5, 2, 0) * w; 
	return sharpFalloff(d + n);
}

function mountainPrimitive(x, y) {
	return 0;
}

function cliffPrimitive(x, y) {
	return 0;
}

function computeElevationForVertices(vertices) {
	for (let i = 0; i < vertices.length; i += 3) {
		let x = vertices[i];
		let y = vertices[i + 2];
		if (stateGUI.PrimitiveType == 0)
			vertices[i + 1] = dunePrimitive(x, y);
		else if (stateGUI.PrimitiveType == 1)
			vertices[i + 1] = craterPrimitive(x, y);
		else if (stateGUI.PrimitiveType == 2)
			vertices[i + 1] = mountainPrimitive(x, y);
		else if (stateGUI.PrimitiveType == 3)
			vertices[i + 1] = cliffPrimitive(x, y);
	}
}

function initScene() {
	initGUI();

	precomputeSpectralWeights(10);
	state.perlin = new ImprovedNoise();
	state.scene = new THREE.Scene();
	state.camera = new THREE.PerspectiveCamera(45, state.width / state.height, 0.1, 1000);
	state.renderer = new THREE.WebGLRenderer();
	state.renderer.setSize(state.width, state.height);
	state.renderer.shadowMap.enabled = true;
	document.getElementById(state.canvasName).appendChild(state.renderer.domElement);

	// Background and ground mesh
	state.scene.background = new THREE.Color( 0xa0a0a0 );
	//state.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

	const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial());
	mesh.position.y = -2.0;
	mesh.rotation.x = - Math.PI / 2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	state.scene.add(mesh);

	// Lights
	const directionnalLight = new THREE.DirectionalLight(0xffffff, 3);
	directionnalLight.position.set(-5, 20, 0);
	directionnalLight.castShadow = true;
	directionnalLight.shadow.camera.near = 0.1;
	directionnalLight.shadow.camera.far = 1000;
	state.scene.add(directionnalLight);

	const ambientlight = new THREE.AmbientLight(0x404040, 10.0); 
	state.scene.add(ambientlight);	

	// Camera
	state.camera.position.z = 10;
	state.camera.position.x = 10;
	state.camera.position.y = 10;
	state.camera.lookAt(0, 0, 0);
	state.controls = new OrbitControls(state.camera, state.renderer.domElement);

	initTerrain(0);
}

function initGUI() {
	const gui = new GUI({autoPlace: false, width: 200})
	gui.domElement.id = 'gui';
	var customContainer = document.getElementById(state.canvasName);
	customContainer.appendChild(gui.domElement);

	gui.add(stateGUI, 'PrimitiveType', 
	{ 
		'Dune': 0, 
		'Crater': 1, 
		'Mountain': 2, 
		'Cliff': 3, 
	}).onChange(value => { stateGUI.PrimitiveType = value; initTerrain(); });
	
	// Controls
	gui.add(stateGUI, 'Frequency', 1, 5).onChange(value => { initTerrain(); });
	gui.add(stateGUI, 'Amplitude', 0.1, 1.0).onChange(value => { initTerrain(); });
	gui.add(stateGUI, 'Radius', 2.0, 7.0).onChange(value => { initTerrain(); });
}

function initTerrain() {
	// Create geometry
	const geometry = new THREE.PlaneGeometry(state.terrainSize, state.terrainSize, state.gridRes, state.gridRes);
	geometry.rotateX(-Math.PI / 2);
	computeElevationForVertices(geometry.attributes.position.array);
	geometry.computeVertexNormals();
	
	// Create object in scene
	state.scene.remove(state.object);
	state.object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial( { color: 0xcfbfae, side: THREE.DoubleSide} ));
	state.object.castShadow = true;
	state.scene.add(state.object);
}

function render() {
	requestAnimationFrame(render);
	state.renderer.render(state.scene, state.camera);
}

initScene();
render();
