<template>
    <TresDirectionalLight
        :position="[-7, 8, 15]"
        :intensity="0.9"
        :color="0xffe8c4"
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
        :intensity="0.1"
        :color="0xaaccff"
    />
    <TresHemisphereLight
        :color="0x88aaff"
        :ground-color="0xffe8c4"
        :intensity="0.15"
    />
</template>
<script setup lang="ts">
</script>
