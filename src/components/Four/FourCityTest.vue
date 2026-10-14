<template>
    <primitive
        v-for="(mesh, i) in instancedMeshes"
        :key="`inst-${i}`"
        :object="mesh"
    />
    <primitive
        v-for="(obj, i) in animatedChars"
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
import { collectAnimations } from "@/utils/four/animate.ts";

const cityStore = useCityStore();

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
// const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
const animatedChars = shallowRef<THREE.Object3D[]>([]);
const mixers: THREE.AnimationMixer[] = [];

function isCharName(str: string) {
    return str.startsWith('char');
}

async function buildModel(modelName: string, configItems: SceneJson[string], result: CityBuildResult): Promise<void> {
    const link = getStaticLink(`/3d/glb/${modelName}.glb`);
    const gltf = await loadCityModel(link);

    gltf.scene.custom_model_name = modelName;

    if (isCharName(modelName) && gltf.animations.length > 0) {
        const { clone, mixer } = createAnimatedClone(gltf, configItems[0]);

        result.animatedChars.push(clone);
        result.mixers.push(mixer);

        return;
    }

    const instances = buildInstancedMeshes(gltf.scene, configItems);

    if (instances.length === 0) {
        console.warn(`[City] No meshes in ${modelName}.glb`);
        return;
    }

    result.instancedMeshes.push(...instances);
}

async function buildScene(): Promise<CityBuildResult> {
    const result: CityBuildResult = {
        instancedMeshes: [],
        animatedChars: [],
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

// const animations: { emissiveBlinking?(elapsed: number); } = {};
// const animations: { emissiveBlinking?(elapsed: number); } = {};
const animations: Function[] = [];

onMounted(async () => {
    const result = await buildScene();

    instancedMeshes.value = result.instancedMeshes;
    animatedChars.value = result.animatedChars;
    mixers.push(...result.mixers);

    const { emissiveBlinkingPlay } = collectAnimations(result.instancedMeshes);

    animations.push(emissiveBlinkingPlay);
});

const { onBeforeRender } = useLoop();

onBeforeRender((ctx) => {
    for (const mixer of mixers) {
        mixer.update(ctx.delta);
    }

    animations.forEach((animation) => {
        animation(ctx);
    });
});

onBeforeUnmount(() => {
    for (const mixer of mixers) {
        mixer.stopAllAction();
    }
    mixers.length = 0;
});
</script>
