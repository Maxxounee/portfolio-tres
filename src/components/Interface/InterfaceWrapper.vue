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
        <InterfaceTextWindow
            ref="textWindow"
        />
        <InterfaceButtonsWrapper
        />
        <InterfaceButtonsItem
            :text="noirModeText"
            class="InterfaceWrapper__noir"
            @click="() => mainStore.toggleNoirMode()"
        />
    </div>
</template>
<script setup lang="ts">
import InterfaceButtonsWrapper from "@/components/Interface/InterfaceButtonsWrapper.vue";
import InterfaceTextWindow from "@/components/Interface/InterfaceTextWindow.vue";
import InterfaceButtonsItem from "@/components/Interface/InterfaceButtonsItem.vue";
import { useMainStore } from "@/store/main.ts";
import { computed } from "vue";

const mainStore = useMainStore();
const noirModeText = computed(() => {
    return mainStore.noirMode ? 'Noir Mode: on' : 'Noir Mode: off';
});
</script>
<style lang="scss">
.InterfaceWrapper {
    @include div100;
    @include flexColumn(center, center);
    pointer-events: none;


    &__noir {
        position: absolute;
        top: var(--T);
        right: var(--R);
    }
}
</style>
