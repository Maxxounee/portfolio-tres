<template>
    <div
        class="InterfaceTextWindow"
        :class="{ active: realActive }"
    >
        <!--        <button class="InterfaceTextWindow__close" @click="active = !active">-->
        <!--            <img src="/svg/close.svg" alt=""/>-->
        <!--        </button>-->
        <div class="InterfaceTextWindow__container">
            <p
                class="InterfaceTextWindow__text InterfaceTextWindow__text_dimension"
                v-html="text"
            ></p>
            <p
                class="InterfaceTextWindow__text InterfaceTextWindow__text_visible"
                v-html="animated"
            ></p>
            <p
                class="InterfaceTextWindow__text InterfaceTextWindow__text_next"
                @click="nextView()"
            >
                Далее
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Texter } from "@/utils/utils.ts";
import { useCityStore } from "@/store/city.ts";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/store/main.ts";

const props = defineProps<{}>();
const mainStore = useMainStore();
const active = ref(true);
const realActive = computed(() => {
    return active.value && !mainStore.noTextMode;
});

const { currentView, isLoaded } = storeToRefs(useCityStore());
const { nextView } = useCityStore();

const text = ref('');
const animated = ref('');
let timeout = null;

watch(() => mainStore.noTextMode, (value) => {
    if (value) {
        active.value = true;
    }
});
watch([currentView, isLoaded], async () => {
    if (!isLoaded) {
        return;
    }

    active.value = false;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
        text.value = currentView.value.html.text ?? '';

        const texter = new Texter({ str: text.value });

        texter.play((value) => animated.value = value);

        active.value = true;
    }, 1000);


});
</script>
<style scoped lang="scss">
.InterfaceTextWindow {
    pointer-events: auto;
    position: absolute;
    //top: var(--top);
    //left: var(--left);
    right: var(--R);
    bottom: var(--B);
    //transform: translate(-50%, -50%);
    white-space: nowrap;
    border: 2px solid var(--BLACK);
    background: var(--DIALOGUE);
    padding: 4rem 5rem 3rem 3rem;
    opacity: 0;
    translate: 4rem 0;

    transition-property: opacity, translate;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;

    &__container {
        @include div100(relative);
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

    &__text {
        @include fontIgra(4rem);
        color: var(--BLACK);
        //color: var(--WHITE);

        &_visible {
            position: absolute;
            top: 0;
            left: 0;
        }

        &_dimension {
            opacity: 0;
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
    }
}
</style>
