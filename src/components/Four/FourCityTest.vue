<template>
    <primitive
        v-for="(mesh, i) in instancedMeshes"
        :key="i"
        :object="mesh"
    />
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { shallowRef, onMounted } from 'vue';
import instancesData from '@/config/four/scene.json';

type Vec3 = [number, number, number]
type InstanceItem = { position: Vec3; rotation: Vec3; scale: Vec3 }
type SceneJson = Record<string, InstanceItem[]>

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);

const loader = new GLTFLoader();

/**
 * Загружает один .glb и возвращает его сцену.
 */
function loadGLB(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            (err) => reject(err),
        );
    });
}

/**
 * Заполняет InstancedMesh матрицами.
 */
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

onMounted(async () => {
    const result: THREE.InstancedMesh[] = [];

    for (const [modelName, items] of Object.entries(data)) {
        if (!items?.length) continue;

        try {
            const root = await loadGLB(`/3d/glb/${modelName}.glb`);

            // Собираем все меши внутри модели
            const sourceMeshes: THREE.Mesh[] = [];
            root.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    sourceMeshes.push(obj);
                }
            });

            if (sourceMeshes.length === 0) {
                console.warn(`[City] No meshes in ${modelName}.glb`);
                continue;
            }

            // Для каждого меша — свой InstancedMesh
            for (const sourceMesh of sourceMeshes) {
                // const mat = new THREE.MeshBasicMaterial({
                //     color: 0xff0000,
                //     side: THREE.DoubleSide,  // ← рисует обе стороны
                // });
                const inst = new THREE.InstancedMesh(
                    sourceMesh.geometry,
                    sourceMesh.material as THREE.Material | THREE.Material[],
                    // mat,
                    items.length,
                );

                // const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                // const inst = new THREE.InstancedMesh(sourceMesh.geometry, wireframeMat, items.length);

                applyInstances(inst, items);
                result.push(inst);
            }
        } catch (err) {
            console.error(`[City] Failed to load ${modelName}.glb`, err);
        }
    }

    instancedMeshes.value = result;

});
</script>
