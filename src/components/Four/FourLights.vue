<template>
    <TresDirectionalLight
        :position="[-7, 8, 15]"
        :intensity="0.3"
        :color="0xffffff"
        cast-shadow
        :shadow-mapSize-width="1024"
        :shadow-mapSize-height="1024"
        :shadow-camera-left="-50"
        :shadow-camera-right="50"
        :shadow-camera-top="50"
        :shadow-camera-bottom="-50"
        :shadow-bias="-0.0008"
    />
    <TresDirectionalLight
        :position="[-15, 10, -10]"
        :intensity="0.01"
        :color="0xffffff"
    />
    <!--    <TresHemisphereLight-->
    <!--        :color="0xffffff"-->
    <!--        :ground-color="0xffe8c4"-->
    <!--        :intensity="1"-->
    <!--    />-->
    <TresHemisphereLight
        :color="0xffffff"
        :ground-color="0xffffff"
        :intensity="0.1"
    />
</template>
<script setup lang="ts">
</script>
