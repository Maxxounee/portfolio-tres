<template>
    <TresMesh :position="[1, 1, 3]">
        <TresCylinderGeometry :args="[1.5, 1.5, 1.5]"/>
        <TresMeshStandardMaterial color="#42b883" :metalness="0.3" :roughness="0.4"/>
    </TresMesh>
    <TresMesh ref="boxRef">
        <TresBoxGeometry :args="[1.5, 1.5, 1.5]"/>
        <TresMeshStandardMaterial color="#42b883" :metalness="0.3" :roughness="0.4"/>
    </TresMesh>
</template>
<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import type { TresInstance } from '@tresjs/core';
import * as THREE from 'three';
import { useTresGui } from "@/utils/tres/useTresGui";

const props = defineProps<{
    position?: [number, number, number]
    rotation: [number, number, number]
    color?: string
}>();

const boxRef = shallowRef<TresInstance | null>(null);
// useTresGui({ cameraRef });
// --- Анимация куба ---

watch(() => props.position, ([x, y, z]) => {
    if (!boxRef.value) return;
    gsap.to(boxRef.value.position, { x, y, z });
});

watch(() => props.rotation, ([x, y, z]) => {
    if (!boxRef.value) return;
    gsap.to(boxRef.value.rotation, {
        x: x * Math.PI / 180,
        y: y * Math.PI / 180,
        z: z * Math.PI / 180,
    });
});

watch(() => props.color, (value) => {
    if (!boxRef.value) return;
    const mat = boxRef.value.material as THREE.MeshStandardMaterial;
    const startColor = mat.color.clone();
    const endColor = new THREE.Color(value);
    const progress = { value: 0 };
    gsap.to(progress, {
        value: 1,
        duration: 1,
        onUpdate: () => mat.color.lerpColors(startColor, endColor, progress.value),
    });
});

// --- Орбита камеры ---
</script>
