<template>
    <primitive
        v-if="state?.scene"
        :object="state.scene"
        @click="press"
        @mouseover="onPointerEnter"
        @pointerenter="onPointerEnter"
        @pointerleave="onPointerLeave"
    />
</template>
<script setup lang="ts">
import { useGLTF, GLTFModel } from '@tresjs/cientos';
import { computed, onMounted, shallowRef, watch, watchEffect } from "vue";
import * as THREE from 'three';

const { state, nodes } = useGLTF('/3d/models/button.glb');


import { gsap } from 'gsap';

const props = defineProps<{
    position?: [number, number, number]
}>();

const defaults = {
    topY: undefined,
};

watchEffect(() => {
    const root = state.value?.scene;

    if (!root || !props.position) return;

    if (nodes.value.top) {
        nodes.value.top.material.emissiveIntensity = 0;
    }

    root.position.set(...props.position);
    root.rotation.set(-45 * Math.PI / 180, 0, 0);


});


const onPointerEnter = () => {
    /* TODO: убрать дублирование с leave */
    document.body.style.cursor = 'pointer';
    const top = nodes.value?.top;

    if (!top) return;

    if (defaults.topY === undefined) {
        defaults.topY = top.position.y;
    }
    gsap.timeline()
        .to(top.position, { y: defaults.topY + 0.1, duration: 0.3 });
};

const onPointerLeave = () => {
    document.body.style.cursor = 'default';

    const top = nodes.value?.top;

    if (!top) return;

    if (defaults.topY === undefined) {
        defaults.topY = top.position.y;
    }
    gsap.timeline()
        .to(top.position, { y: defaults.topY, duration: 0.08 });
};

const press = (): void => {
    emit('click');
    /* TODO блокировка анимаций ховера при работае анимации клика */
    const top = nodes.value?.top;

    if (!top) return;

    if (defaults.topY === undefined) {
        defaults.topY = top.position.y;
    }

    const mat = (top as any).material;

    gsap.timeline()
        .to(top.position, { y: defaults.topY - 0.3, duration: 0.08 })
        .to(top.position, { y: defaults.topY, duration: 1, ease: 'elastic.out(1, 0.4)', });


    gsap.timeline()
        .to(mat, { emissiveIntensity: 0.4, duration: 0.08 }, 0)
        .to(mat, { emissiveIntensity: 0, duration: 0.3 }, 0.1);
};
const emit = defineEmits(['click']);
onMounted(() => {

});
</script>
<style scoped lang="scss">
.ThreeMeshButton {

}
</style>
