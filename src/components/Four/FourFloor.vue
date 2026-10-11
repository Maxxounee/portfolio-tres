<template>
    <TresMesh
        :position="[0, -0.1, 0]"
        :rotation="[-Math.PI / 2, 0, 0]"
        :receive-shadow="true"
    >
        <TresPlaneGeometry :args="[200, 200]"/>
        <TresMeshStandardMaterial
            color="#1a1a1a"
            :roughness="1"
            :metalness="0"
        />
    </TresMesh>
</template>
<script setup lang="ts">
</script>
<style scoped>
</style>
