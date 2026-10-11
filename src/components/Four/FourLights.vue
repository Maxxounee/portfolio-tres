<template>
    <!-- KEY:  -->
    <TresDirectionalLight
        :position="[15, 25, 10]"
        :intensity="0.8"
        :color="0xffe8c4"
        cast-shadow
        :shadow-mapSize-width="2048"
        :shadow-mapSize-height="2048"
        :shadow-camera-left="-50"
        :shadow-camera-right="50"
        :shadow-camera-top="50"
        :shadow-camera-bottom="-50"
        :shadow-bias="-0.0005"
    />
    <!-- FILL: мягкий, чтобы тени не были чёрными -->
    <TresDirectionalLight
        :position="[-15, 10, -10]"
        :intensity="0.3"
        :color="0xaaccff"
    />
    <!--    RIM: холодный контровой, отделяет от фона-->
    <TresDirectionalLight
        :position="[-10, 15, -25]"
        :intensity="0.6"
        :color="0xffe8c4"
    />
    <!-- HEMISPHERE: естественная засветка неба/земли -->
    <TresHemisphereLight
        :color="0x88aaff"
        :ground-color="0xffe8c4"
        :intensity="0.1"
    />
</template>
<script setup lang="ts">
import { Environment } from '@tresjs/cientos';
// import { watchEffect } from 'vue';
//
// const { environment } = await useEnvironment({
//     preset: 'dawn',      // или 'dawn', 'night', 'forest', 'warehouse'
//     background: true,     // не показывать HDRI как фон
// });
</script>
<style scoped lang="scss">
.ThreeLights {

}
</style>
