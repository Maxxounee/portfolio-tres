<template>
    <Precipitation
        :count="2000"
        :speed="3.3"
        :randomness="0"
        :size="0.01"
        :area="[30, 20, 30]"
        color="#ffffff"
        :opacity="0.3"
    />
    <Stars/>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { useLoop, useTres } from "@tresjs/core";
import * as cityConfig from "@/config/four/city";
import { Precipitation, Stars } from "@tresjs/cientos";
import { gsap } from "gsap";
import type { Ref } from "vue";
import { onMounted } from "vue";

const { scene, camera } = useTres();
const { onBeforeRender } = useLoop();

// const baseFogFar = 10;
const baseFogFar = 90;
const startColor = new THREE.Color(cityConfig.colors.backgroundStart);
const endColor = new THREE.Color(cityConfig.colors.backgroundEnd);
const fogColor = new THREE.Color(cityConfig.colors.fog);
const fog = new THREE.Fog(fogColor, 0, baseFogFar);

scene.value.fog = fog;
scene.value.background = new THREE.Color(startColor);

function animateBackground(scene: Ref<THREE.Scene>, start: THREE.Color, end: THREE.Color) {
    const progress = { value: 0 };
    // gsap.to(progress, {
    //     value: 1,
    //     repeat: -1,
    //     yoyo: true,
    //     duration: 10,
    //     ease: 'none',
    //     onUpdate: () => {
    //         scene.value.background.lerpColors(start, end, progress.value);
    //         scene.value.fog.color.copy(scene.value.background);
    //     }
    // });
}

onBeforeRender((ctx) => {
    if (!camera.value?.position) return;

    const heightFactor = camera.value.position.y;
    // fog.far = baseFogFar + (heightFactor ** 1.5) * 5;
});

onMounted(() => {
    animateBackground(scene, startColor, endColor);
});
</script>
<style lang="scss" scoped>
</style>
