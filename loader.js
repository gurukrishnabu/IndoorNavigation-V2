import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function loadModel(scene, callback) {

    const loader = new GLTFLoader();

    loader.load(

        "./models/campus.glb",

        (gltf) => {

            const model = gltf.scene;

            // -------------------------
            // Scale & Position
            // -------------------------

            model.scale.set(1, 1, 1);

            model.position.set(0, 0, 0);

            // -------------------------
            // Enable Shadows
            // -------------------------

            model.traverse((child) => {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                    console.log(child.name);

                }

            });

            scene.add(model);

            // -------------------------
            // Center Model
            // -------------------------

            const box = new THREE.Box3().setFromObject(model);

            const center = box.getCenter(new THREE.Vector3());

            const size = box.getSize(new THREE.Vector3());

            model.position.sub(center);

            console.log("MODEL SIZE", size);
            console.log("MODEL CENTER", center);

            // -------------------------
            // Store Room Centers
            // -------------------------

            model.userData.rooms = {};

            model.traverse((child) => {

                if (!child.isMesh) return;

                const roomBox = new THREE.Box3().setFromObject(child);

                const roomCenter = roomBox.getCenter(new THREE.Vector3());

                model.userData.rooms[child.name] = roomCenter;

            });

            console.log(
                "ROOMS FOUND",
                Object.keys(model.userData.rooms)
            );

            // -------------------------
            // Return Model
            // -------------------------

            callback(model);

        },

        undefined,

        (error) => {

            console.error(error);

        }

    );

}