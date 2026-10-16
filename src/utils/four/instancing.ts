import * as THREE from 'three';
import type { InstanceItem } from './types';
import { collectMixerAnimations } from "@/utils/four/collectMixerAnimations.ts";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CustomAnimator } from "@/utils/four/CustomAnimator.ts";

function applyInstances(mesh: THREE.InstancedMesh, items: InstanceItem[]): void {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3();

    items.forEach((item, i) => {
        position.set(...item.position);
        euler.set(...item.rotation);
        quaternion.setFromEuler(euler);
        scale.set(...item.scale);

        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(i, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
}

export function buildInstancedMeshes(gltf: GLTF, items: InstanceItem[]): {
    instances: THREE.InstancedMesh[],
    mixer: THREE.AnimationMixer | null
} {
    const sourceMeshes: THREE.Mesh[] = [];

    const scene: THREE.Object3D = gltf.scene;

    gltf.scene.traverse((obj: THREE.Mesh | THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
            sourceMeshes.push(obj);
        }
    });

    if (sourceMeshes.length === 0) {
        console.warn('instancing. sourceMeshes.length === 0');
        return { instances: [], mixer: null };
    }

    const result: THREE.InstancedMesh[] = [];

    for (const sourceMesh of sourceMeshes) {
        const inst = new THREE.InstancedMesh(
            sourceMesh.geometry,
            sourceMesh.material as THREE.Material | THREE.Material[],
            items.length,
        );

        inst.userData.modelName = scene.userData.modelName;

        if (scene.userData.modelName.startsWith('building')) {
            inst.castShadow = true;
            inst.receiveShadow = true;
        } else {
            inst.castShadow = true;
            inst.receiveShadow = true;
        }

        applyInstances(inst, items);

        result.push(inst);
    }

    const mixer = collectMixerAnimations(gltf.animations, scene);
    
    CustomAnimator.collectAnimatedMaterials(gltf.scene);

    return { instances: result, mixer };
}
