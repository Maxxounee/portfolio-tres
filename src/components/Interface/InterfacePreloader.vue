<template>
    <div
        class="InterfacePreloader"
        :class="{ done: done }"
    >
        <div
            class="InterfacePreloader__background"
            :style="{
                '--clip': cityStore.totalModelsLoadedPercent * 100 + 'vh',
             }"
        >
            <p class="InterfacePreloader__message" :class="{ done: isDone }">
                {{ percent }} %
            </p>
        </div>
        <p class="InterfacePreloader__message" :class="{ done: isDone }">
            {{ percent }} %
        </p>
    </div>
</template>
<script setup lang="ts">
import { useCityStore } from "@/store/city.ts";
import { computed, ref, watch } from "vue";

const cityStore = useCityStore();
const done = ref(false);

const percent = computed(() => {
    return Math.round(cityStore.totalModelsLoadedPercent * 100);
});

const isDone = computed(() => {
    return cityStore.totalModelsLoadedPercent > 0.99;
});

watch(isDone, (value) => {
    if (value) {
        setTimeout(() => done.value = true, 1000);
    }
});
</script>
<style scoped lang="scss">
.InterfacePreloader {
    @include div100;
    @include flex(center, center);
    background: var(--WHITE);
    text-align: right;
    pointer-events: auto;
    transition-property: opacity;
    transition-duration: 1s;

    &__background {
        @include div100;
        @include flex(center, center);

        background: var(--BLACK);
        clip-path: inset(0px 0px var(--clip) 0px);
        transition: clip-path 1s ease;

        .InterfacePreloader__message {
            color: var(--WHITE);

        }
    }

    &__message {
        @include fontWiguru(10rem);
        color: var(--BLACK);
        transition-property: opacity;
        transition-duration: 1s;

        &.done {
            opacity: 0;
        }
    }

    &.done {
        opacity: 0;
        pointer-events: none !important;
    }
}
</style>
