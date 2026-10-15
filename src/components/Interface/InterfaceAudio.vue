<template>
    <div class="InterfaceAudio">
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { getStaticLink } from "@/utils";
import { useMainStore } from "@/store/main.ts";

let music: HTMLAudioElement | null = null;
const mainStore = useMainStore();

watch(() => mainStore.musicOn, (value) => {
    if (value) {
        music?.play();
    } else {
        music?.pause();
    }
});
onMounted(() => {
    music = new Audio(getStaticLink('/audio/evening_cafe.mp3'));
    music.loop = true;
    music.volume = 0.2;
});
</script>
<style scoped lang="scss">
.InterfaceAudio {

}
</style>
