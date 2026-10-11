<template>
    <TresOrthographicCamera
        ref="cameraRef"
        :args="[
            -viewWidth / 2,
            viewWidth / 2,
            viewHeight / 2,
            -viewHeight / 2,
            0.1,
            1000,
        ]"
        :position="[0, 12, 0]"
        :look-at="[0,1, 0]"
        :up="[0, 0, -1]"
    />
    <TresAmbientLight :intensity="1"/>
    <ThreeMeshButton
        v-for="(val, i) in buttons"
        :key="i"
        :position="val.pos"
        @click="val.cb"
    />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ThreeMeshButton from '@/components/Four/Controls/FourControlsButton.vue';
import { useTresGui } from '@/utils/tres/useTresGui';
import { useCityStore } from "@/store/city";


/* ---------------- Камера ---------------- */

const viewHeight = ref(20);
const aspect = ref(window.innerWidth / window.innerHeight);
const viewWidth = computed(() => viewHeight.value * aspect.value);

/* ---------------- Позиционирование кнопок ---------------- */

const cityStore = useCityStore();
const buttonCount = 3;
const buttonWidth = 2;
const gap = 0.3;
const bottomMarginPx = 0;

const unitsPerPixel = computed(() => viewHeight.value / window.innerHeight);

const bottomZ = computed(() =>
    viewHeight.value / 2 - 1.4,
);

const totalWidth = buttonCount * buttonWidth + (buttonCount - 1) * gap;

const buttons = computed(() =>
    Array.from({ length: cityStore.cityViewObjects.length }, (val, i) => {
        const x = -totalWidth / 2 + buttonWidth / 2 + i * (buttonWidth + gap);

        return {
            pos: [x, 0, bottomZ.value],
            cb: () => emit('click', i),
        };
    }),
);


const updateAspect = (): void => {
    aspect.value = window.innerWidth / window.innerHeight;
};

onMounted(() => {
    window.addEventListener('resize', updateAspect);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateAspect);
});

const emit = defineEmits(['click']);
</script>
