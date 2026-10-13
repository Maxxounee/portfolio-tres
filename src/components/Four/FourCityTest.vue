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
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';
import { useLoop } from '@tresjs/core';
import instancesData from '@/config/four/scene.json';
import pLimit from "p-limit";

import {
    buildInstancedMeshes,
    createAnimatedClone,
    loadCityModel,
    type SceneJson,
    type CityBuildResult,
} from '@/utils/four';
import { getStaticLink } from "@/utils";
import { useCityStore } from "@/store/city.ts";

const cityStore = useCityStore();

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
const animatedModels = shallowRef<THREE.Object3D[]>([]);
const mixers: THREE.AnimationMixer[] = [];

async function buildModel(modelName: string, items: SceneJson[string], result: CityBuildResult): Promise<void> {
    const link = getStaticLink(`/3d/glb/${modelName}.glb`);
    const gltf = await loadCityModel(link);
    /* Добавил, чтобы потом настроить тени в buildInstancedMeshes */
    gltf.scene.custom_model_name = modelName;

    if (gltf.animations.length > 0) {
        for (const item of items) {
            const { clone, mixer } = createAnimatedClone(gltf, item);
            result.animatedModels.push(clone);
            result.mixers.push(mixer);
        }
        return;
    }

    const instances = buildInstancedMeshes(gltf.scene, items);

    if (instances.length === 0) {
        console.warn(`[City] No meshes in ${modelName}.glb`);
        return;
    }

    result.instancedMeshes.push(...instances);
}

async function buildScene(): Promise<CityBuildResult> {
    const result: CityBuildResult = {
        instancedMeshes: [],
        animatedModels: [],
        mixers: [],
    };

    const limit = pLimit(6);

    const entries = Object.entries(data).filter(([, items]) => items?.length);
    cityStore.setTotalModelsCount(entries.length);

    await Promise.all(
        entries.map(([modelName, items]) => {
            return limit(async () => {
                try {
                    await buildModel(modelName, items, result);
                } catch (err) {
                    console.error(`[City] ошибка загрузки ${modelName}`, err);
                } finally {
                    cityStore.incrementTotalModels();
                }
            });
        }),
    );

    return result;
}

onMounted(async () => {
    const result = await buildScene();

    instancedMeshes.value = result.instancedMeshes;
    animatedModels.value = result.animatedModels;
    mixers.push(...result.mixers);
});

/* ============================================================
 *  Loop
 * ==========================================================*/

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
