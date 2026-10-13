<template>
    <TresGroup
        :position="[2.5, 4, -1.4]"
        :rotation="[0, 1, 0]"
    >
        <primitive v-if="state?.scene" :object="state.scene"/>
    </TresGroup>
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos';
import { useLoop } from '@tresjs/core';
import { shallowRef, watch } from 'vue';
import * as THREE from 'three';
import { getStaticLink } from "@/utils";

const { state } = useGLTF(getStaticLink('/3d/models/man.glb'));

const mixer = shallowRef<THREE.AnimationMixer | null>(null);

watch(
    state,
    (gltf) => {
        if (!gltf?.scene) return;

        mixer.value = new THREE.AnimationMixer(gltf.scene);

        // console.log('Available animations:', gltf.animations.map(a => a.name));
        if (gltf.animations.length > 0) {
            console.log(gltf.animations);
            // playAnimation(gltf.animations[0].name);
            playAnimation('Push_Ups');
        }
    },
    { immediate: true },
);

const playAnimation = (name: string): void => {
    const m = mixer.value;
    const gltf = state.value;
    if (!m || !gltf) return;

    const clip = THREE.AnimationClip.findByName(gltf.animations, name);
    if (!clip) return;

    m.stopAllAction();
    const action = m.clipAction(clip);
    action.reset();
    // action.setLoop(THREE.LoopOnce, 100);
    action.clampWhenFinished = true;
    action.play();

};

const { onBeforeRender } = useLoop();
onBeforeRender((ctx) => {
    mixer.value?.update(ctx.delta);
});

// экспозим наружу для управления из родителя
defineExpose({ playAnimation });
</script>
