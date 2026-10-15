<template>
    <TresPerspectiveCamera
        ref="cameraRef"
        :fov="20"
        :near="0.1"
        :far="1000"
    />
    <OrbitControls ref="controlsRef"/>
</template>
<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos';
import { useTresGui } from '@/utils/tres/useTresGui';
import { ref, shallowRef, computed, type Ref } from 'vue';
import type { TresInstance } from '@tresjs/core';
import type * as THREE from 'three';

/** Camera ref. */
const cameraRef = ref<TresInstance | null>(null);

/** Ref на OrbitControls. */
const controlsRef = shallowRef<TresInstance | null>(null);

/**
 * target у OrbitControls лежит внутри .instance.
 * Достаём его через computed, чтобы useTresGui видел живую ссылку.
 */
const targetRef = computed<THREE.Vector3 | null>(() => {
    const inst = controlsRef.value?.instance as
        | { target?: THREE.Vector3 }
        | undefined;
    return inst?.target ?? null;
});

useTresGui({
    cameraRef,
    targetRef: targetRef as Ref<THREE.Vector3 | null>,
});
</script>
