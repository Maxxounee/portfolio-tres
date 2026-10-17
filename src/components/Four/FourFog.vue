<template>
    <Precipitation
        :count="isMobile ? 1000 :  2000"
        :speed="3.3"
        :randomness="0"
        :size="0.06"
        :area="isMobile ? [20, 15, 20] : [30, 20, 30]"
        color="#ffffff"
        :opacity="0.3"
    />
    <Stars ref="starsRef" v-if="!isMobile"/>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { useLoop, useTres } from "@tresjs/core";
import * as cityConfig from "@/config/four/city";
import { Precipitation, Stars } from "@tresjs/cientos";
import { gsap } from "gsap";
import type { Ref } from "vue";
import { nextTick, onMounted, shallowRef, watch } from "vue";
import { useMainStore } from "@/store/main.ts";
import { useWindow } from "@/utils/useWindow.ts";

const { scene, camera } = useTres();
const { onBeforeRender } = useLoop();
const { isMobile } = useWindow();

const starsRef = shallowRef();
const baseFogFar = 90;
const nightColor = new THREE.Color(cityConfig.colors.backgroundNight);
const dayColor = new THREE.Color(cityConfig.colors.backgroundDay);
const fogColor = new THREE.Color(cityConfig.colors.fog);
const fog = new THREE.Fog(fogColor, 0, baseFogFar);

scene.value.fog = fog;
scene.value.background = nightColor.clone();
const mainStore = useMainStore();

function toggleBackground(isDay) {
    const startColor = isDay ? nightColor : dayColor;
    const endColor = isDay ? dayColor : nightColor;
    const progress = { value: 0 };


    gsap.to(progress, {
        value: 1,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
            (scene.value.background as THREE.Color).lerpColors(
                startColor,
                endColor,
                progress.value,
            );
        },
    });
}

watch(() => mainStore.dayMode, (value) => {
    toggleBackground(value);
});

function removeFogFromStars() {
    if (isMobile) {
        return;
    }
    const stars = starsRef.value as any;

    const points = stars?.instance as THREE.Points | undefined;

    if (!points) {
        console.warn('[FourFog.onMounted] Points не найдены');
        return;
    }

    const mat = points.material as THREE.PointsMaterial;
    mat.fog = false;
    mat.needsUpdate = true;
}

onMounted(() => {
    removeFogFromStars();
});
</script>
<style lang="scss" scoped>
</style>
