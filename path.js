import * as THREE from "three";

let currentPath = null;

export function drawPath(scene, route) {

    // Remove old path
    if (currentPath) {

        scene.remove(currentPath);

    }

    const points = [];

    route.forEach(point => {

        points.push(

            new THREE.Vector3(
                point.x,
                0.15,
                point.z
            )

        );

    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({

        color: 0x00aaff,

        linewidth: 5

    });

    currentPath = new THREE.Line(

        geometry,

        material

    );

    scene.add(currentPath);

}