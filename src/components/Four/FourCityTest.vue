<template>
    <primitive
        v-for="(mesh, i) in instancedMeshes"
        :key="`inst-${i}`"
        :object="mesh"
    />
    <primitive
        v-for="(obj, i) in animatedChars"
        :key="`char-${i}`"
        :object="obj"
    />
    <primitive
        v-for="(obj, i) in animatedCars"
        :key="`car-${i}`"
        :object="obj"
    />
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { shallowRef, onMounted, watch } from 'vue';
import { useLoop, useTres } from '@tresjs/core';
import instancesData from '@/config/four/scene.json';
import pLimit from "p-limit";

import {
    buildInstancedMeshes,
    createAnimatedSkeleton,
    loadCityModel,
    type SceneJson,
    type CityBuildResult,
} from '@/utils/four';
import { getStaticLink } from "@/utils";
import { useCityStore } from "@/store/city.ts";
import { createAnimatedModel } from "@/utils/four/createAnimatedModel.ts";
import { useMainStore } from "@/store/main.ts";
import { loadEnvAudio } from "@/utils/four/loadEnvAudio.ts";
import { CustomAnimator } from "@/utils/four/CustomAnimator.ts";
import { SoundLoader } from "@/utils/four/SoundLoader.ts";

const emit = defineEmits(['loaded']);

const cityStore = useCityStore();
const mainStore = useMainStore();

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
const animatedChars = shallowRef<THREE.Object3D[]>([]);
const animatedCars = shallowRef<THREE.Object3D[]>([]);
const mixers: THREE.AnimationMixer[] = [];

const { camera } = useTres();
const audio = shallowRef<THREE.PositionalAudio[]>([]);

async function buildModel(modelName: string, configItems: SceneJson[string], result: CityBuildResult): Promise<void> {
    const link = getStaticLink(`/3d/glb/${modelName}.glb`);
    const gltf = await loadCityModel(link);

    gltf.scene.userData.modelName = modelName;

    if (modelName.startsWith('char')) {
        const { model, mixer } = createAnimatedSkeleton(gltf, configItems[0]);

        result.animatedChars.push(model);

        if (mixer) {
            result.mixers.push(mixer);
        }

        return;
    } else if (modelName.startsWith('car')) {
        const { model, mixer } = createAnimatedModel(gltf);

        result.animatedCars.push(model);
        result.animatedCarsMap[modelName] = model;

        if (mixer) {
            result.mixers.push(mixer);
        }

        return;
    } else {
        const { instances, mixer } = buildInstancedMeshes(gltf, configItems);

        if (mixer) {
            result.mixers.push(mixer);
        }

        if (instances.length === 0) {
            console.warn(`[City] No meshes in ${modelName}.glb`);
            return;
        }

        result.instancedMeshes.push(...instances);
    }
}

async function buildScene(): Promise<CityBuildResult> {
    const result: CityBuildResult = {
        instancedMeshes: [],
        animatedChars: [],
        animatedCars: [],
        animatedCarsMap: {},
        mixers: [],
    };

    const limit = pLimit(6);

    const entries = Object.entries(data).filter(([, items]) => items?.length);
    cityStore.setTotalModelsCount(entries.length);

    await Promise.all(
        entries.map(([modelName, items]) =>
            limit(async () => {
                try {
                    await buildModel(modelName, items, result);
                } catch (err) {
                    console.error(`[City] ошибка загрузки ${modelName}`, err);
                } finally {
                    cityStore.incrementTotalModels();
                }
            }),
        ),
    );

    return result;
}


watch(() => mainStore.musicOn, (value) => {
    if (!audio.value.length) {
        return;
    }

    audio.value.forEach((sound) => {
        if (value && !sound.isPlaying) {
            sound.play();
        } else {
            sound.pause();
        }
    });

});

onMounted(async () => {
    const result = await buildScene();

    instancedMeshes.value = result.instancedMeshes;
    animatedChars.value = result.animatedChars;
    animatedCars.value = result.animatedCars;
    mixers.push(...result.mixers);

    emit('loaded', { nodes: result.animatedCarsMap });

    if (camera.value instanceof THREE.Camera) {
        const audioLoader = new SoundLoader({ camera: camera.value });

        audioLoader.loadMany([
            {
                target: result.animatedCarsMap['car_05'],
                path: getStaticLink('/audio/env/helicopter.mp3'),
                refDistance: 1,
                volume: 8,
                loopStart: 0.01,
                loopEnd: 0.9,
            },
            {
                target: result.animatedCarsMap['car_00'],
                path: getStaticLink('/audio/env/car.mp3'),
                refDistance: 1,
                loopStart: 0.05,
                loopEnd: 0.9
            },
        ]).then((data) => {
            audio.value.push(...data.map(({ sound }) => sound));
        });

    } else {
        console.error('LoadEnvAudio: camera.value undefined');
    }


});

const { onBeforeRender } = useLoop();

onBeforeRender((ctx) => {
    for (const mixer of mixers) {
        mixer.update(ctx.delta);
    }

    CustomAnimator.play(ctx);
});
</script>
