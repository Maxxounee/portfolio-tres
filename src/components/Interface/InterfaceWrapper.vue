<template>
    <div class="InterfaceWrapper">
        <h1 class="InterfaceWrapper__title">
            ПРИВЕТ! Меня зовут Максим<br/>
            Hello! My name is Maksim
        </h1>
    </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss">
.InterfaceWrapper {
    @include div100;
    @include flex(center, center);

    &__title {
        @include fontAcBoucle(10rem);
        font-family: pobeda, serif;
    }
}
</style>
