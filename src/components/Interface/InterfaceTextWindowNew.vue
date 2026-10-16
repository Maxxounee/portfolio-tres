<template>
    <div
        class="InterfaceTextWindowNew"
        :class="{ active: realActive }"
    >
        <div class="InterfaceTextWindowNew__container">
            <p class="InterfaceTextWindowNew__title" v-html="title">
            </p>
            <p
                class="InterfaceTextWindowNew__text InterfaceTextWindowNew__text_visible"
                v-html="text"
            ></p>
            <!--            <p-->
            <!--                class="InterfaceTextWindowNew__text InterfaceTextWindowNew__text_next"-->
            <!--                @click="nextView()"-->
            <!--            >-->
            <!--                Далее-->
            <!--            </p>-->
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCityStore } from '@/store/city.ts';
import { useMainStore } from '@/store/main.ts';

const mainStore = useMainStore();
const cityStore = useCityStore();

const active = ref(false);
const text = ref('');
const title = ref('');

let timeout: ReturnType<typeof setTimeout> | null = null;

const realActive = computed(() => {
    return active.value && !mainStore.noTextMode;
});

watch(
    [
        () => cityStore.currentView,
        () => cityStore.isLoaded,
        () => mainStore.preloaderHidden
    ],
    ([view, loaded, preloader]) => {
        if (!loaded || !preloader) return;
        if (!view) return;

        if (timeout) clearTimeout(timeout);
        active.value = false;

        timeout = setTimeout(() => {
            text.value = view.html.text ?? '';
            title.value = view.html.title ?? '';
            active.value = true;
        }, 1000);
    },
    { immediate: true },
);

watch(() => mainStore.noTextMode, (value) => {
        if (value) {
            timeout && clearTimeout(timeout);
        }
    },
);
</script>
<style lang="scss">
.InterfaceTextWindowNew {
    @include div100;
    pointer-events: none;
    color: var(--ORANGE);
    perspective: 1200px;
    opacity: 0;
    //translate: 3rem;

    transition-property: opacity, translate, clip-path;
    transition-duration: 1s, 1s;
    transition-timing-function: ease-in-out;

    //clip-path: inset(0% 1000% 0% 0%);

    &__container {
        @include div100(relative);
        @include flexColumn(center);
        //transform: rotateY(-20deg) rotateZ(-5deg) rotateX(10deg);
        //transform: rotateY(-20deg);
        padding: 15rem 40rem 5rem;
    }

    &__close {
        @include size(20px);
        position: absolute;
        top: 5px;
        right: 5px;
        transition-property: rotate;
        transition-duration: 0.2s;

        &:hover {
            rotate: 90deg;
        }
    }

    &__title {
        @include fontKulag(10rem);
        white-space: nowrap;
        //@include center;
        //top: 15rem;
    }

    &__text {
        pointer-events: auto;
        //@include fontIgra(7rem);
        //@include size(100%);
        @include fontKulag(5rem);
        margin-top: 10rem;
        //width: 100vw;
        text-align: center;
        //white-space: nowrap;
        //@include fontPodkova(4rem);
        //width: 40vw;
        //border: 2px solid red;
        //color: var(--BLACK);
        //color: var(--WHITE);
        a {
            text-decoration: underline;

            &:hover {
                text-decoration: none;
            }
        }

        &_visible {
            //position: absolute;
            //top: 0;
            //left: 0;
        }

        &_dimension {
            opacity: 0;
            position: absolute;
        }

        &_next {
            position: relative;
            //margin-left: auto;
            display: block;
            margin-top: 3rem;
            width: max-content;
            cursor: pointer;

            &:after {
                content: '';
                width: 100%;
                position: absolute;
                height: 2px;
                bottom: 0.4rem;
                left: 0;
                background: var(--BLACK);
            }
        }
    }

    &.active {
        opacity: 1;
        translate: none;
        clip-path: inset(0);
    }
}
</style>
