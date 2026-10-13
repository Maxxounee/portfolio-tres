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
            :position="[90, 90]"
            ref="textWindow"
        />
        <InterfaceButtons/>
    </div>
</template>
<script setup lang="ts">
import InterfaceButtons from "@/components/Interface/InterfaceButtons.vue";
import InterfaceTextWindow from "@/components/Interface/InterfaceTextWindow.vue";
</script>
<style lang="scss">
.InterfaceWrapper {
    @include div100;
    @include flexColumn(center, center);
    pointer-events: none;

    &__title {
        @include fontPodkova(10rem);
    }

    &__text {
        margin-top: 10rem;
        //@include fontAcBoucle(5rem);
        //@include fontDewberry(5rem);
        @include fontIgra(3rem);

    }
}
</style>
