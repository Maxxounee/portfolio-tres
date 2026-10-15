<template>
    <TresDirectionalLight
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
        :position="[-4, 1.6, -4.2]"
    />
    <TresSpotLight
        v-if="billboardTarget"
        ref="billboard"
        :position="[-4, 2.9, -6]"
        :intensity="10"
        :target="billboardTarget"
        :width="4"
        :height="2"
        :color="0xfadd07"
        :distance="10"
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
    <TransformControls
        v-if="debug"
        :object="billboardTarget"
    />
    <TresHemisphereLight
        :color="0xffffff"
        :ground-color="0xffffff"
        :intensity="0.1"
    />
</template>
<script setup lang="ts">
import { vLightHelper } from '@tresjs/core';
import { TransformControls } from '@tresjs/cientos';
import { nextTick, onMounted, ref, shallowRef, watch } from "vue";

const billboard = ref();
const billboardTarget = ref();

const debug = false;

if (debug) {
    watch(() => billboard.value?.position, () => {
        console.log(billboard.value.position);
    }, { deep: true },);

    watch(() => billboardTarget.value?.position, () => {
        console.log(billboardTarget.value.position);
    }, { deep: true },);
}
</script>
