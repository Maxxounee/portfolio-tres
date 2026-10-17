<template>
    <div class="InterfaceWrapper">
        <h1 class="InterfaceWrapper__title">
            <!--            Hello! My name is Maksim-->
        </h1>
        <!--        <p class="InterfaceWrapper__text">-->
        <!--            - JavaScript, TypeScript, Vue, Nuxt — Options API / Composition API, архитектура приложений,-->
        <!--            разработка компонентов и модулей;-->
        <!--        </p>-->
        <!--        <p-->
        <!--            class="InterfaceWrapper__text"-->
        <!--            v-html="str"-->
        <!--        >-->
        <!--        </p>-->
        <!--        <InterfaceTextWindow-->
        <!--        />-->
        <InterfaceTextWindowNew/>
        <InterfaceButtonsWrapper v-if="!isMobile"/>
        <InterfaceFunctions/>
        <!--        <div class="InterfaceWrapper__func">-->
        <!--            <InterfaceButtonsItem-->
        <!--                :text="noirModeText"-->
        <!--                class="InterfaceWrapper__noir"-->
        <!--                @click="() => mainStore.toggleNoirMode()"-->
        <!--            />-->
        <!--            <InterfaceButtonsItem-->
        <!--                :text="noTextModeText"-->
        <!--                class="InterfaceWrapper__noir"-->
        <!--                @click="() => mainStore.toggleTextMode()"-->
        <!--            />-->
        <!--            <InterfaceButtonsItem-->
        <!--                :text="musicModeText"-->
        <!--                class="InterfaceWrapper__music"-->
        <!--                @click="() => mainStore.toggleMusicMode()"-->
        <!--            />-->
        <!--            <InterfaceButtonsItem-->
        <!--                :text="dayModeText"-->
        <!--                class="InterfaceWrapper__day"-->
        <!--                @click="() => mainStore.toggleDayMode()"-->
        <!--            />-->
        <!--        </div>-->
    </div>
</template>
<script setup lang="ts">
import InterfaceButtonsWrapper from "@/components/Interface/InterfaceButtonsWrapper.vue";
import InterfaceTextWindowNew from "@/components/Interface/InterfaceTextWindowNew.vue";
import InterfaceFunctions from "@/components/Interface/InterfaceFunctions.vue";
import { useWindow } from "@/utils/useWindow.ts";
// import InterfaceTextWindow from "@/components/Interface/InterfaceTextWindow.vue";
// import InterfaceButtonsItem from "@/components/Interface/InterfaceButtonsItem.vue";
// import { useMainStore } from "@/store/main.ts";
// import { computed } from "vue";

// const mainStore = useMainStore();
// const noirModeText = computed(() => {
//     return mainStore.noirMode ? 'Noir Mode: on' : 'Noir Mode: off';
// });
// const noTextModeText = computed(() => {
//     return mainStore.noTextMode ? 'Hide text: on' : 'Hide text: off';
// });
// const musicModeText = computed(() => {
//     return mainStore.musicOn ? 'Sound: on' : 'Sound: off';
// });
// const dayModeText = computed(() => {
//     return mainStore.dayMode ? 'Day: on' : 'Day: off';
// });
const { isMobile } = useWindow();
</script>
<style lang="scss">
.InterfaceWrapper {
    @include div100v;
    @include flexColumn(center, center);
    pointer-events: none;

    &__func {
        //@include flexColumn(end);
        @include flex(start);
        gap: 2rem;
        position: absolute;
        //top: var(--T);
        right: var(--R);
        //left: var(--L);
        bottom: var(--B);
    }

    &__noir {
    }
}
</style>
