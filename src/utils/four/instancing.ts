import * as THREE from 'three';
import type { InstanceItem } from './types';

export function applyInstances(mesh: THREE.InstancedMesh, items: InstanceItem[]): void {
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

export function buildInstancedMeshes(
    scene: THREE.Object3D & { custom_model_name?: string }, items: InstanceItem[]
): THREE.InstancedMesh[] {
    const sourceMeshes: THREE.Mesh[] = [];

    scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            sourceMeshes.push(obj);
        }
    });

    if (sourceMeshes.length === 0) {
        return [];
    }

    const result: THREE.InstancedMesh[] = [];

    for (const sourceMesh of sourceMeshes) {
        const inst = new THREE.InstancedMesh(
            sourceMesh.geometry,
            sourceMesh.material as THREE.Material | THREE.Material[],
            items.length,
        );

        /* TODO: выбрать модели, которые будут отбрасывать тень */
        /* TODO: 2. или просто запечь тени и свет */
        if (typeof scene.custom_model_name === 'string') {
            if (scene.custom_model_name.startsWith('building')) {
                inst.castShadow = true;
                inst.receiveShadow = true;
            } else {
                inst.castShadow = true;
                inst.receiveShadow = true;
            }
        }

        applyInstances(inst, items);
        result.push(inst);
    }

    return result;
}
