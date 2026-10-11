<template>
    <TresMesh ref="sunRef" :position="[10, 0, -30]">
        <TresSphereGeometry :args="[1, 10, 16]"/>
        <TresMeshBasicMaterial
            color="#FFDDAA"
            :transparent="true" :depthWrite="false"
        />
    </TresMesh>
    <EffectComposerPmndrs>
        <GodRaysPmndrs
            :light-source="sunRef"
            :samples="60"
            :density="0.96"
            :decay="0.9"
            :weight="0.8"
            :exposure="0.1"
            :opacity="0.8"
        />
    </EffectComposerPmndrs>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { EffectComposerPmndrs, GodRaysPmndrs } from '@tresjs/post-processing';
import { NoToneMapping } from 'three';

const sunRef = ref();

const gl = {
    toneMapping: NoToneMapping,
};
</script>
