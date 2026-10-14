<template>
    <TresDirectionalLight
        :position="[9, 12, -20]"
        :intensity="0.1"
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
    <TresPointLight
        :position="[-3, 3 ,3]"
        :intensity="1"
    />
    <TresPointLight
        :position="[-3, 3 ,6]"
        :intensity="3"
    />
    <TresPointLight
        :position="[-9, 3 ,2]"
        :intensity="3"
    />
    <TresPointLight
        :position="[3, 3 ,10]"
        :intensity="3"
    />
    <TresPointLight
        :position="[-6, 3 ,-6]"
        :intensity="3"
    />
    <!--    <TresPointLightHelper/>-->
    <!--    <TresDirectionalLight-->
    <!--        :position="[-20, 10, -20]"-->
    <!--        :intensity="0.1"-->
    <!--        :color="0xffffff"-->
    <!--    />-->
    <!--    <TresDirectionalLightHelper/>-->
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
