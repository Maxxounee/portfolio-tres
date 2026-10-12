<template>
    <primitive
        v-for="(mesh, i) in instancedMeshes"
        :key="`inst-${i}`"
        :object="mesh"
    />
    <primitive
        v-for="(obj, i) in animatedModels"
        :key="`anim-${i}`"
        :object="obj"
    />
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';
import { useLoop } from '@tresjs/core';
import instancesData from '@/config/four/scene.json';

type Vec3 = [number, number, number]
type InstanceItem = { position: Vec3; rotation: Vec3; scale: Vec3 }
type SceneJson = Record<string, InstanceItem[]>

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
const animatedModels = shallowRef<THREE.Object3D[]>([]);

const loader = new GLTFLoader();

const mixers: THREE.AnimationMixer[] = [];


function loadGLB(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf),
            undefined,
            (err) => reject(err),
        );
    });
}

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


function createAnimatedClone(gltf: GLTF, item: InstanceItem,): THREE.Object3D {
    const clone = SkeletonUtils.clone(gltf.scene);

    clone.position.set(...item.position);
    clone.rotation.set(...item.rotation);
    clone.scale.set(...item.scale);

    clone.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    const mixer = new THREE.AnimationMixer(clone);

    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    });

    mixers.push(mixer);

    return clone;
}

onMounted(async () => {
    const instancedResult: THREE.InstancedMesh[] = [];
    const animatedResult: THREE.Object3D[] = [];

    for (const [modelName, items] of Object.entries(data)) {
        if (!items?.length) continue;

        try {
            const gltf = await loadGLB(`${import.meta.env.BASE_URL}3d/glb/${modelName}.glb`);

            if (gltf.animations.length > 0) {
                for (const item of items) {
                    animatedResult.push(createAnimatedClone(gltf, item));
                }
                continue;
            }

            const sourceMeshes: THREE.Mesh[] = [];
            gltf.scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    sourceMeshes.push(obj);
                }
            });

            if (sourceMeshes.length === 0) {
                console.warn(`[City] No meshes in ${modelName}.glb`);
                continue;
            }

            for (const sourceMesh of sourceMeshes) {
                const inst = new THREE.InstancedMesh(
                    sourceMesh.geometry,
                    sourceMesh.material as THREE.Material | THREE.Material[],
                    items.length,
                );

                applyInstances(inst, items);
                instancedResult.push(inst);
            }
        } catch (err) {
            console.error(`[City] Failed to load ${modelName}.glb`, err);
        }
    }

    instancedMeshes.value = instancedResult;
    animatedModels.value = animatedResult;
});

const { onBeforeRender } = useLoop();

onBeforeRender((ctx) => {
    for (const mixer of mixers) {
        mixer.update(ctx.delta);
    }
});

onBeforeUnmount(() => {
    for (const mixer of mixers) {
        mixer.stopAllAction();
    }
    mixers.length = 0;
});
</script>
