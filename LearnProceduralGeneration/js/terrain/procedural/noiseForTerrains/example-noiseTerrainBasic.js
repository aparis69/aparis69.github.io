import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { precomputeSpectralWeights, fBm } from 'js/libs/noiselib.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

state = {
	scene: null,
	renderer: null,
	camera: null,
	width: 700,
	height: 600,
	object: null,
	controls: null,
	gridRes: 256,
	terrainSize: 10,
	perlin: null,

	canvasName: "NoiseTerrainBasic",
}
stateGUI = {
	Frequency: 0.65,
	Amplitude: 1.3,
}
var state;
var stateGUI;

function addNoiseToVertices(vertices) {
	for (let i = 0; i < vertices.length; i += 3) {
		let x = vertices[i];
		let y = vertices[i + 2];
		vertices[i + 1] = fBm(x, y, state.perlin, stateGUI.Amplitude, stateGUI.Frequency, 1, 0); 
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
	state.scene.background = new THREE.Color().setRGB(1.0, 1.0, 1.0);

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

	// Controls
	gui.add(stateGUI, 'Frequency', 0, 1).onChange(value => { initTerrain(); });
	gui.add(stateGUI, 'Amplitude', 0.1, 2.0).onChange(value => { initTerrain(); });
}

function initTerrain(noiseType) {
	// Create geometry
	const geometry = new THREE.PlaneGeometry(state.terrainSize, state.terrainSize, state.gridRes, state.gridRes);
	geometry.rotateX(-Math.PI / 2);
	addNoiseToVertices(geometry.attributes.position.array);
	geometry.computeVertexNormals();
	
	// Create object in scene
	state.scene.remove(state.object);
	state.object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial( { color: 0xcfbfae, side: THREE.DoubleSide} ));
	state.scene.add(state.object);
}

function render() {
	requestAnimationFrame(render);
	state.renderer.render(state.scene, state.camera);
}

initScene();
render();
