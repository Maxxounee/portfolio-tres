<template>
    <primitive
        v-if="cityState?.scene"
        :object="cityState.scene"
    />
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { shallowRef, watch } from 'vue';
import * as THREE from 'three';
import * as cityConfig from "@/config/four/city";

/* --------------------------------------- */

const emit = defineEmits<{
    loaded: [
        model: {
            cityScene: THREE.Group;
            cityNodes: Record<string, THREE.Object3D>
        }
    ],
}>();

const { onBeforeRender } = useLoop();
const { state: cityState, nodes: cityNodes } = useGLTF(cityConfig.files.city);
const mixer = shallowRef<THREE.AnimationMixer | null>(null);

function startSceneAnimations(gltf) {
    mixer.value = new THREE.AnimationMixer(gltf.scene);

    gltf.animations.forEach((clip) => {
        const action = mixer.value!.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    });
}

function showShadows(gltf) {
    gltf.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });
}

watch(cityState, (gltf) => {
    if (!gltf?.scene) {
        return;
    }

    startSceneAnimations(gltf);
    showShadows(gltf);
    emit('loaded', {
        cityScene: gltf.scene,
        cityNodes: cityNodes.value,
    });
});

onBeforeRender((ctx) => {
    mixer.value?.update(ctx.delta);
});
</script>
