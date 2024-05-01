// Third party librairies
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Custom imports
import { DiscreteHeightField, ProceduralHeightField } from 'js/terrain/intro/heightfield.js';

state = {
	scene: null,
	renderer: null,
	camera: null,
	width: 750,
	height: 422,
	object: null,
	controls: null,
	canvasName: "ExampleIntro",
    hf: null
}
stateGUI = {
	Resolution: 256,
	TerrainType: 0
}
var state;
var stateGUI;

function initScene() {
    initGUI();

	state.scene = new THREE.Scene();
	state.camera = new THREE.PerspectiveCamera(45, state.width / state.height, 0.1, 1000);
	state.renderer = new THREE.WebGLRenderer();
	state.renderer.setSize(state.width, state.height);
	state.renderer.shadowMap.enabled = true;
	document.getElementById(state.canvasName).appendChild(state.renderer.domElement);

	// Background and ground mesh
	state.scene.background = new THREE.Color( 0xa0a0a0 );
	state.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

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

	initTerrain();
}

function initGUI() {
	const gui = new GUI({autoPlace: false, width: 200})
	gui.domElement.id = 'gui';
	var customContainer = document.getElementById(state.canvasName);
	customContainer.appendChild(gui.domElement);
	gui.add(stateGUI, 'Resolution', 
	{ 
		'256': 256, 
		'512': 512, 
		"1024": 1024,  
	}).onChange(() => { initTerrain(); });

	gui.add(stateGUI, 'TerrainType', 
	{ 
		'Discrete': 0, 
		'Procedural': 1
	}).onChange(() => { initTerrain(); });
}

function loadHeightfieldFromFile(file) {
    const img = new Image();
    img.src = file; 

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    img.addEventListener("load", () => {
        ctx.drawImage(img, 0, 0);

        let data = new Float32Array(img.width * img.height);
        for (var i = 0; i < img.width; i++) {
            for (var j = 0; j < img.height; j++) {
                let index = i * img.height + j;
                data[index] = ctx.getImageData(i, j, 1, 1).data[0] / 255.0;
            }
        }

        state.hf = new DiscreteHeightField(
            new THREE.Vector2(10, 10), 
            new THREE.Vector2(0, 7),
            img.width,
            img.height,
            data
        );

        canvas.remove();
        initTerrainGeometry();
    });
}

function initTerrain() {
	if (stateGUI.TerrainType == 0) {
		// Discrete heightfield
		loadHeightfieldFromFile("../../js/terrain/intro/heightfield.png"); // This calls initTerrainGeometry() already
	}
	else if (stateGUI.TerrainType == 1) {
		// Analytic heightfield
		state.hf = new ProceduralHeightField(new THREE.Vector2(10, 10), new THREE.Vector2(0, 10));
		initTerrainGeometry();
	}
}

function initTerrainGeometry() {
	// Create geometry
	const geometry = state.hf.CreateMesh(stateGUI.Resolution, stateGUI.Resolution).CreateThreeJsGeometry();
    geometry.rotateX(-Math.PI / 2);

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
