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
            <p
                class="InterfaceTextWindowNew__text InterfaceTextWindowNew__next"
                @click="cityStore.nextView()"
            >
                <span class="InterfaceTextWindowNew__next-inner InterfaceTextWindowNew__next-inner_first">
                    Далее
                </span>
                <span class="InterfaceTextWindowNew__next-inner InterfaceTextWindowNew__next-inner_second">
                    Далее
                </span>
            </p>
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
.device-desktop {
    .InterfaceTextWindowNew {
        @include div100;
        pointer-events: none;
        color: var(--ORANGE);
        perspective: 1200px;
        opacity: 0;

        transition-property: opacity, translate, clip-path;
        transition-duration: 1s, 1s;
        transition-timing-function: ease-in-out;

        &__container {
            @include div100(relative);
            @include flexColumn(center);

            padding: 15rem 40rem 5rem;
        }


        &__title {
            @include fontKulag(10rem);
            white-space: nowrap;

        }

        &__text {

            @include fontKulag(5rem);
            margin-top: 10rem;
            text-align: center;

            a {
                text-decoration: underline;

                &:hover {
                    text-decoration: none;
                }
            }


            &_dimension {
                opacity: 0;
                position: absolute;
            }

            &_next {
                display: block;
                margin-top: 3rem;
            }
        }

        &__next {
            position: absolute;
            bottom: var(--B);
            overflow: hidden;
            width: max-content;
            height: 1.1em;
            cursor: pointer;

            &:after {
                content: '';
                width: 100%;
                position: absolute;
                height: 2px;
                bottom: 0;
                left: 0;
                background: var(--ORANGE);
            }

            &-inner {
                display: block;
                transition-property: translate;
                transition-duration: 0.3s;
            }

            &:hover {

                .InterfaceTextWindowNew__next-inner {
                    translate: 0 -100%;

                    &_first {
                    }
                }
            }


        }


        &.active {
            opacity: 1;
            translate: none;
            clip-path: inset(0);

            .InterfaceTextWindowNew__text {
                pointer-events: auto;
            }
        }
    }

}

.device-mobile {
    .InterfaceTextWindowNew {
        @include div100;
        pointer-events: none;
        color: var(--ORANGE);
        perspective: 1200px;
        opacity: 0;

        transition-property: opacity, translate, clip-path;
        transition-duration: 1s, 1s;
        transition-timing-function: ease-in-out;

        &__container {
            @include div100(relative);
            @include flexColumn(center, center);
            padding: 3rem 3rem 3rem;
        }


        &__title {
            @include fontKulag(12rem);
            white-space: nowrap;
        }

        &__text {

            @include fontKulag(5rem);
            margin-top: 10rem;
            text-align: center;

            a {
                text-decoration: underline;

                &:hover {
                    text-decoration: none;
                }
            }


            &_dimension {
                opacity: 0;
                position: absolute;
            }

            &_next {
                display: block;
                margin-top: 3rem;
            }
        }

        &__next {
            @include font(7rem);
            position: absolute;
            bottom: 5rem;
            overflow: hidden;
            width: max-content;
            height: 1.1em;
            cursor: pointer;

            &:after {
                content: '';
                width: 100%;
                position: absolute;
                height: 2px;
                bottom: 0;
                left: 0;
                background: var(--ORANGE);
            }

            &-inner {
                display: block;
                transition-property: translate;
                transition-duration: 0.3s;
            }

        }


        &.active {
            opacity: 1;
            translate: none;
            clip-path: inset(0);

            .InterfaceTextWindowNew__text {
                pointer-events: auto;
            }
        }
    }
}
</style>
