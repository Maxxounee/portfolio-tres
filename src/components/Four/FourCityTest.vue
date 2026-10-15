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
import { shallowRef, onMounted, onBeforeUnmount, watch } from 'vue';
import { useLoop, useTres } from '@tresjs/core';
import instancesData from '@/config/four/scene.json';
import pLimit from "p-limit";

import {
    buildInstancedMeshes,
    loadAnimatedSkeleton,
    loadCityModel,
    type SceneJson,
    type CityBuildResult,
} from '@/utils/four';
import { getStaticLink } from "@/utils";
import { useCityStore } from "@/store/city.ts";
import { collectAnimations } from "@/utils/four/animate.ts";
import { loadAnimatedModel } from "@/utils/four/loadAnimatedModel.ts";
import { useMainStore } from "@/store/main.ts";

const emit = defineEmits(['loaded']);

const cityStore = useCityStore();

const data = instancesData as SceneJson;

const instancedMeshes = shallowRef<THREE.InstancedMesh[]>([]);
const animatedChars = shallowRef<THREE.Object3D[]>([]);
const animatedCars = shallowRef<THREE.Object3D[]>([]);
const mixers: THREE.AnimationMixer[] = [];
const { camera } = useTres();

async function buildModel(modelName: string, configItems: SceneJson[string], result: CityBuildResult): Promise<void> {
    const link = getStaticLink(`/3d/glb/${modelName}.glb`);
    const gltf = await loadCityModel(link);

    gltf.scene.custom_model_name = modelName;

    if (modelName.startsWith('char')) {
        const { clone, mixer } = loadAnimatedSkeleton(gltf, configItems[0]);

        result.animatedChars.push(clone);
        result.mixers.push(mixer);

        return;
    }


    if (modelName.startsWith('car')) {
        const model = loadAnimatedModel(gltf, result);
        result.animatedCars.push(model);

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
        animatedCars: [],
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

const animations: Function[] = [];
const audio = shallowRef<THREE.PositionalAudio | null>(null);


const mainStore = useMainStore();

watch(() => mainStore.musicOn, (value) => {
    if (!audio.value) {
        return;
    }

    if (value && !audio.value.isPlaying) {
        audio.value.play();
    } else {
        audio.value?.pause();
    }
});
onMounted(async () => {
    const result = await buildScene();
    instancedMeshes.value = result.instancedMeshes;
    animatedChars.value = result.animatedChars;
    animatedCars.value = result.animatedCars;
    mixers.push(...result.mixers);


    const carNodes: Record<string, THREE.Object3D> = {};

    for (const obj of result.animatedCars) {
        const name = obj.custom_model_name;

        if (name) {
            carNodes[name] = obj;
        }
    }

    emit('loaded', { nodes: carNodes });

    const { emissiveBlinkingPlay } = collectAnimations(result.instancedMeshes);

    animations.push(emissiveBlinkingPlay);


    const listener = new THREE.AudioListener();
    const loader = new THREE.AudioLoader();

    camera.value?.add(listener);

    loader.load(
        getStaticLink('/audio/env/helicopter.mp3'),
        (buffer) => {
            const sound = new THREE.PositionalAudio(listener);
            const target = carNodes['car_05'];
            console.log(target);
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.6);
            sound.setRefDistance(20);
            sound.setRolloffFactor(1.5);
            sound.setDistanceModel('exponential');

            target.add(sound);
            audio.value = sound;
            // audio.value.play();
            // bladesAudio.value = sound
        }
    );

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
