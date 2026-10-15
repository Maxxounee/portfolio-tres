<template>
    <div
        class="InterfacePreloader"
        :class="{
            loaded: loaded,
            active: active
        }"
    >
        <div
            class="InterfacePreloader__background"
            :style="{
                '--clip': cityStore.totalModelsLoadedPercent * 100 + 'vh',
             }"
        >
            <p class="InterfacePreloader__message" :class="{ loaded: isLoaded }">
                {{ percent }} %
            </p>
        </div>
        <p class="InterfacePreloader__message" :class="{ loaded: isLoaded }">
            {{ percent }} %
        </p>
        <p class="InterfacePreloader__start" @click="() => start()">
            Начать
        </p>
    </div>
</template>
<script setup lang="ts">
import { useCityStore } from "@/store/city.ts";
import { computed, ref, watch } from "vue";
import { useMainStore } from "@/store/main.ts";

const cityStore = useCityStore();
const loaded = ref(false);
const active = ref(true);
const mainStore = useMainStore();

const percent = computed(() => {
    return Math.round(cityStore.totalModelsLoadedPercent * 100);
});

const isLoaded = computed(() => {
    return cityStore.totalModelsLoadedPercent > 0.99;
});

function start() {
    active.value = false;
    mainStore.toggleMusicMode();
}

watch(isLoaded, (value) => {
    if (value) {
        setTimeout(() => loaded.value = true, 1000);
    }
});
</script>
<style scoped lang="scss">
.InterfacePreloader {
    @include div100;
    @include flex(center, center);
    background: var(--DIALOGUE);
    text-align: right;
    transition-property: opacity;
    transition-duration: 1s;
    pointer-events: none;
    opacity: 0;

    &__background {
        @include div100;
        @include flex(center, center);

        background: var(--BLACK);
        clip-path: inset(0px 0px var(--clip) 0px);
        transition: clip-path 1s ease;

        .InterfacePreloader__message {
            color: var(--DIALOGUE);
        }
    }

    &__start,
    &__message {
        @include fontIgra(10rem);
        color: var(--BLACK);
        transition-property: opacity;
        transition-duration: 1s;

        &.loaded {
            opacity: 0;
        }
    }

    &__start {
        @include center;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
    }

    &.loaded {
        .InterfacePreloader__start {
            opacity: 1;
            pointer-events: auto;
        }

        //opacity: 0;
        //pointer-events: none !important;
    }

    &:not(.active) {
        .InterfacePreloader__start {
            opacity: 1;
            pointer-events: none;
        }
    }

    &.active {
        opacity: 1;
        pointer-events: auto;
    }
}
</style>
