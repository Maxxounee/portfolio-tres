<template>
    <TresDirectionalLight
        ref="mainLight"
        :position="[9, 12, -20]"
        :intensity="0.1"
        :color="0xffffff"
        cast-shadow
        :shadow-mapSize-width="1024"
        :shadow-mapSize-height="1024"
        :shadow-camera-left="-50"
        :shadow-camera-right="50"
        :shadow-camera-top="50"
        :shadow-camera-bottom="-50"
        :shadow-bias="-0.0008"
    />
    <TresPointLight
        :position="[-3, 3 ,3]"
        :intensity="1"
    />
    <TresPointLight
        :position="[-3, 3 ,6]"
        :intensity="3"
    />
    <TresPointLight
        :position="[-9, 3 ,2]"
        :intensity="3"
    />
    <TresPointLight
        :position="[3, 3 ,10]"
        :intensity="3"
    />
    <TresPointLight
        :position="[-6, 3 ,-6]"
        :intensity="3"
    />
    <!--        <TresPointLight v-light-helper :intensity="3" />-->
    <!--    <TresPointLight-->
    <!--        ref="target"-->
    <!--        v-light-helper-->
    <!--        :position="[-4, 3 ,-5]"-->
    <!--        :intensity="3"-->
    <!--        :color="0xfadd07"-->
    <!--    />-->
    <TresObject3D
        ref="billboardTarget"
        :position="[-4, -2.6, -4.6]"
    />
    <TresSpotLight
        v-if="billboardTarget"
        ref="billboard"
        :position="[-4, 3.6, -6]"
        :intensity="10"
        :target="billboardTarget"
        :color="0xfadd07"
        :distance="10"
        cast-shadow
    />
    <TresObject3D
        ref="breakingTarget"
        :position="[7.6, -0.7, 5.8]"
    />
    <TresSpotLight
        v-if="breakingTarget"
        ref="breaking"
        :position="[9.8, 0.36, 4]"
        :intensity="5"
        :target="breakingTarget"
        :color="0xfadd07"
        :distance="7"
        cast-shadow
    />
    <!--    <TresPointLightHelper/>-->
    <!--    <TresDirectionalLight-->
    <!--        :position="[-20, 10, -20]"-->
    <!--        :intensity="0.1"-->
    <!--        :color="0xffffff"-->
    <!--    />-->
    <!--    <TresDirectionalLightHelper/>-->
    <!--    <TresHemisphereLight-->
    <!--        :color="0xffffff"-->
    <!--        :ground-color="0xffe8c4"-->
    <!--        :intensity="1"-->
    <!--    />-->
    <!--    <TransformControls-->
    <!--        v-if="debug"-->
    <!--        :object="billboardTarget"-->
    <!--    />-->
    <TresHemisphereLight
        ref="generalLight"
        :color="0xffffff"
        :ground-color="0xffffff"
        :intensity="0.1"
    />
</template>
<script setup lang="ts">
import { useLoop, useTres, vLightHelper } from '@tresjs/core';
import { TransformControls } from '@tresjs/cientos';
import { nextTick, onMounted, ref, shallowRef, watch } from "vue";
import { useMainStore } from "@/store/main.ts";
import { gsap } from 'gsap';

const mainLight = ref();
const generalLight = ref();

const billboard = ref();
const billboardTarget = ref();

const breaking = ref();
const breakingTarget = ref();

const debug = true;

if (debug) {
    watch(() => billboard.value?.position, () => {
        console.log(billboard.value.position);
    }, { deep: true },);

    watch(() => billboardTarget.value?.position, () => {
        console.log(billboardTarget.value.position);
    }, { deep: true },);

    watch(() => breaking.value?.position, () => {
        console.log(breaking.value.position);
    }, { deep: true },);

    watch(() => breakingTarget.value?.position, () => {
        console.log(breakingTarget.value.position);
    }, { deep: true },);
}


/* =================================== */

const mainStore = useMainStore();
const { onBeforeRender } = useLoop();

let tl: gsap.core.Timeline | null = null;

function toggleLight(isDay = false) {
    tl?.kill();
    tl = gsap.timeline({ ease: 'inOut.quad' });

    const day = {
        mainLight: {
            intensity: 1,
            position: {
                x: 9,
                y: 30,
                z: -20
            }
        },
        generalLight: {
            intensity: 1,
        }
    };

    const night = {
        mainLight: {
            intensity: 0.1,
            position: {
                x: 9,
                y: 12,
                z: -20
            }
        },
        generalLight: {
            intensity: 0.1,
        }
    };

    const conf = isDay ? day : night;

    tl
    .to(mainLight.value, {
        intensity: conf.mainLight.intensity,
        duration: 3,
    }, 0)
    .to(mainLight.value.position, {
        ...conf.mainLight.position,
        duration: 4,
    }, 0)
    .to(generalLight.value, {
        intensity: conf.generalLight.intensity,
        duration: 3,
    }, 0);
}

watch(() => mainStore.dayMode, (value) => {
    toggleLight(value);
});

onBeforeRender((ctx) => {

});
</script>
