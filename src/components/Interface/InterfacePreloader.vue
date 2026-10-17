<template>
    <div
        class="InterfacePreloader"
        :class="{
            loaded: loaded,
            active: active,
        }"
        :style="{
            '--progress': cityStore.totalModelsLoadedPercent,
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
        <div class="InterfacePreloader__line"></div>
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
import { computed, onBeforeMount, ref, watch } from "vue";
import { useMainStore } from "@/store/main.ts";
import { useWindow } from "@/utils/useWindow.ts";

const cityStore = useCityStore();
const loaded = ref(false);
const mainStore = useMainStore();
const isMobile = useWindow();
const active = computed(() => {
    return !mainStore.preloaderHidden;
});

const percent = computed(() => {
    return Math.round(cityStore.totalModelsLoadedPercent * 100);
});

const isLoaded = computed(() => {
    return cityStore.totalModelsLoadedPercent > 0.99;
});

function start() {
    if (!isMobile) {
        mainStore.toggleMusicMode();
    }
    mainStore.hidePreloader();
}

onBeforeMount(() => {
    mainStore.showPreloader();
});
watch(isLoaded, (value) => {
    if (value) {
        setTimeout(() => loaded.value = true, 1000);
    }
});
</script>
<style scoped lang="scss">
.InterfacePreloader {
    @include div100v;
    @include flex(center, center);
    //background: var(--DIALOGUE);
    background: var(--BLACK);
    text-align: right;
    transition-property: opacity;
    transition-duration: 1s;
    pointer-events: none;
    opacity: 0;

    &__background {
        @include div100;
        @include flex(center, center);

        //background: var(--ORANGE);
        clip-path: inset(0px 0px var(--clip) 0px);
        transition: clip-path 1s ease;

        .InterfacePreloader__message {
            //color: var(--DIALOGUE);
        }
    }

    &__line {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 1rem;
        width: 100vw;
        background: var(--ORANGE);
        transform: translateX(calc(-100% * (1 - var(--progress))));
        transition-property: transform, opacity;
        transition-duration: 0.3s;
        transition-timing-function: linear;
    }

    &__start,
    &__message {
        @include fontKulag(10rem);
        color: var(--ORANGE);
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

        .InterfacePreloader__line {
            opacity: 0;
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
