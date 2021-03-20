import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    Reflector
} from 'three/examples/jsm/objects/Reflector.js'
import {
    PointerLockControls
} from './PointerlockcontrolsMobile'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
const debugObject = {}
const objects = [];
let camera, scene, renderer, controls;

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
// const vertex = new THREE.Vector3();
// const color = new THREE.Color();
const canvas = document.querySelector('blocker')
init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 30;
    // シーンを開始
    scene = new THREE.Scene();

    //  ライト設定
    const hemisphereLight = new THREE.HemisphereLight(0x939ef6, 0xF3EEFF, 1);
    // gui.add(hemisphereLight, 'intensity').min(0).max(10).step(0.001).name('hemispherelightIntensity')
    hemisphereLight.position.set(0.5, 1, 0.75);
    scene.add(hemisphereLight);
    // ポイントライト１
    const pointLight1 = new THREE.PointLight(0xf3d8af, 1, 1, 2);
    pointLight1.position.set(-500, 50, 6.058)
    pointLight1.shadow.mapSize.set(1024, 1024)
    pointLight1.shadow.normalBias = 0.05
    pointLight1.castShadow = true
    scene.add(pointLight1);
    const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1);
    scene.add(pointLightHelper1);
    // gui.add(pointLight1, 'intensity').min(0).max(120).step(0.001).name('pointlight1Intensity')
    // gui.add(pointLight1.position, 'x').min(-500).max(500).step(10).name('pointlight1X')
    // gui.add(pointLight1.position, 'y').min(0).max(100).step(10).name('pointlight1Y')
    // gui.add(pointLight1.position, 'z').min(-5).max(20).step(10).name('pointlight1Z')

    // ポイントライト2
    const pointLight2 = new THREE.PointLight(0xf3d8af, .6);
    pointLight2.position.set(-50, 50, -20)
    pointLight2.shadow.mapSize.set(1024, 1024)
    pointLight2.shadow.normalBias = 0.05
    pointLight2.castShadow = true
    scene.add(pointLight2);
    const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, .9, 0);
    scene.add(pointLightHelper2);
    // gui.add(pointLight2, 'intensity').min(0).max(120).step(0.001).name('pointligh2tIntensity')
    // gui.add(pointLight2.position, 'x').min(-500).max(500).step(10).name('pointlight2X')
    // gui.add(pointLight2.position, 'y').min(0).max(100).step(10).name('pointlight2Y')
    // gui.add(pointLight2.position, 'z').min(-50).max(500).step(10).name('pointlight21Z')

    // ポイントライト3
    const pointLight3 = new THREE.PointLight(0x4355c7, .6);
    pointLight3.position.set(400, 50, -680)
    pointLight3.shadow.mapSize.set(1024, 1024)
    pointLight3.shadow.normalBias = 0.05
    pointLight3.castShadow = true
    scene.add(pointLight3);
    const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1, 10);
    scene.add(pointLightHelper3);
    // gui.add(pointLight3, 'intensity').min(0).max(120).step(0.001).name('pointlight3Intensity')
    // gui.add(pointLight3.position, 'x').min(-10004).max(1000).step(10).name('pointlight3X')
    // gui.add(pointLight3.position, 'y').min(0).max(100).step(10).name('pointlight3Y')
    // gui.add(pointLight3.position, 'z').min(-1000).max(1000).step(10).name('pointlight3Z')


    // ポインターロック設定
    controls = new PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {

        controls.lock();

    }, false);

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });

    scene.add(controls.getObject());



    const onKeyDown = function (event) {

        switch (event.keyCode) {

            case 38:
            case 87:
                moveForward = true;
                break;

            case 37:
            case 65:
                moveLeft = true;
                break;

            case 40:
            case 83:
                moveBackward = true;
                break;

            case 39:
            case 68:
                moveRight = true;
                break;

            case 32:
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }


    };

    const onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38:
            case 87:
                moveForward = false;
                break;

            case 37:
            case 65:
                moveLeft = false;
                break;

            case 40:
            case 83:
                moveBackward = false;
                break;

            case 39:
            case 68:
                moveRight = false;
                break;

        }

    };

    // スマホ前進
    const forward = document.getElementById('controller-forward')
    forward.addEventListener("touchstart", function () {
        console.log("touch")
        moveForward = true;
    })
    forward.addEventListener("touchend", function () {
        console.log("end")
        moveForward = false;
    })
    forward.addEventListener("touchmove", function () {
        console.log("end")
        moveForward = false;
    })
    // スマホ右
    const right = document.getElementById('controller-right')
    right.addEventListener("touchstart", function () {
        moveRight = true;
    })
    right.addEventListener('touchend', function () {
        moveRight = false
    })

    // スマホ左
    const left = document.getElementById('controller-left')
    left.addEventListener("touchstart", function () {
        moveLeft = true;
    })
    left.addEventListener('touchend', function () {
        moveLeft = false
    })

    // スマホ後ろ
    const back = document.getElementById('controller-back')
    back.addEventListener("touchstart", function () {
        moveBackward = true;
    })
    back.addEventListener('touchend', function () {
        moveBackward = false
    })


    document.addEventListener("touchmove", function () {
        console.log("moved")

    })
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
    /**
     * Update all materials
     */
    const updateAllMaterials = () => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                // child.material.envMap = environmentMap
                child.material.envMapIntensity = debugObject.envMapIntensity
                child.material.needsUpdate = true
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }
    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
        '/textures/environmentMaps/sky/px.png',
        '/textures/environmentMaps/sky/nx.png',
        '/textures/environmentMaps/sky/py.png',
        '/textures/environmentMaps/sky/ny.png',
        '/textures/environmentMaps/sky/pz.png',
        '/textures/environmentMaps/sky/nz.png'
    ])

    environmentMap.encoding = THREE.sRGBEncoding

    scene.background = environmentMap
    scene.environment = environmentMap

    debugObject.envMapIntensity = 5
    // gui.add(debugObject, 'envMapIntensity').min(0).max(100).step(0.001).onChange(updateAllMaterials)
    // // floor

    let floorGeometry = new THREE.CircleGeometry(500, 64);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshLambertMaterial();

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, 0, -500)
    scene.add(floor);


    /**
     * Models
     */
    let model = null
    gltfLoader.load(
        '/models/210318_ring.glb',
        (gltf) => {
            const model = gltf.scene
            model.castShadow = true
            model.receiveShadow = true
            gltf.scene.scale.set(20, 20, 20)
            gltf.scene.position.set(0, 0.1, -550)
            gltf.scene.rotation.y = 2.225
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.reflectivity = .5
                }
            })
            scene.add(gltf.scene)
            console.log(gltf.scene)

            // gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
            // gui.add(gltf.scene.position, 'x').min(-3).max(2).step(0.001).name('modelpositionx')
            // gui.add(gltf.scene.position, 'y').min(-3).max(2).step(0.001).name('modelpositiony')
            // gui.add(gltf.scene.position, 'z').min(-3).max(30).step(0.001).name('modelpositionz')
            updateAllMaterials()
        }
    )

    //

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}




function animate() {

    requestAnimationFrame(animate);

    const time = performance.now();

    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 8.0 * delta;
    velocity.y -= 0 * delta; // 100.0 = mass
    direction.z = Number(moveForward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward) velocity.z -= direction.z * 400.0 * delta;
    if (moveBackward) velocity.z += 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
        velocity.y = Math.max(0, velocity.y);
        velocity.x = 0;
        velocity.z = 0;
        canJump = true;
    }


    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += (velocity.y * delta);
    if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
    }


    prevTime = time;

    renderer.render(scene, camera);

}