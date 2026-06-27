import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { loadModel } from "./loader.js";
import { rooms } from "./rooms.js";

console.log("PVP Indoor Navigation Started");

// --------------------------------------------------
// HTML Elements
// --------------------------------------------------

const viewer = document.getElementById("viewer");

const roomName = document.getElementById("roomName");
const roomDepartment = document.getElementById("roomDepartment");
const roomFloor = document.getElementById("roomFloor");
const roomQR = document.getElementById("roomQR");

// --------------------------------------------------
// Scene
// --------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101820);

// --------------------------------------------------
// Camera
// --------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    60,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    1000
);

camera.position.set(20, 18, 20);

// --------------------------------------------------
// Renderer
// --------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.shadowMap.enabled = true;

viewer.appendChild(renderer.domElement);

// --------------------------------------------------
// Controls
// --------------------------------------------------

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0,0,0);
controls.update();

// --------------------------------------------------
// Lights
// --------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff,2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2);
directionalLight.position.set(30,40,30);
directionalLight.castShadow = true;
scene.add(directionalLight);

// --------------------------------------------------
// Helpers
// --------------------------------------------------

scene.add(new THREE.GridHelper(50,50));
scene.add(new THREE.AxesHelper(5));

// --------------------------------------------------
// Variables
// --------------------------------------------------

let campusModel = null;
let selectedRoom = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --------------------------------------------------
// Load Campus
// --------------------------------------------------

loadModel(scene,(model)=>{

    campusModel=model;

    console.log("Campus Ready");

});

// --------------------------------------------------
// Mouse Click
// --------------------------------------------------

renderer.domElement.addEventListener("click",(event)=>{

    if(!campusModel) return;

    const rect=renderer.domElement.getBoundingClientRect();

    mouse.x=((event.clientX-rect.left)/rect.width)*2-1;

    mouse.y=-((event.clientY-rect.top)/rect.height)*2+1;

    raycaster.setFromCamera(mouse,camera);

    const intersects=raycaster.intersectObjects(
        campusModel.children,
        true
    );

    if(intersects.length===0) return;

    const room=intersects[0].object;

    console.log("Clicked :",room.name);

    if(
        selectedRoom &&
        selectedRoom.material &&
        selectedRoom.material.emissive
    ){

        selectedRoom.material.emissive.setHex(0x000000);

    }

    selectedRoom=room;

    if(
        room.material &&
        room.material.emissive
    ){

        room.material.emissive.setHex(0x00ff00);

    }

    const info=rooms[room.name];

    if(!info) return;

    roomName.textContent=info.name;

    roomDepartment.textContent=
        "Department : "+info.department;

    roomFloor.textContent=
        "Floor : "+info.floor;

    roomQR.textContent=
        "QR : "+info.qr;

});

// --------------------------------------------------
// Animation
// --------------------------------------------------

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();

// --------------------------------------------------
// Resize
// --------------------------------------------------

window.addEventListener("resize",()=>{

    camera.aspect=
        viewer.clientWidth/
        viewer.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        viewer.clientWidth,
        viewer.clientHeight
    );

});