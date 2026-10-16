<template>
    <div class="InterfaceAudio">
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { getStaticLink } from "@/utils";
import { useMainStore } from "@/store/main.ts";

let music: HTMLAudioElement[] = [];
const mainStore = useMainStore();

watch(() => mainStore.musicOn, (value) => {
    if (value) {
        music.forEach((sound) => {
            sound?.play();
        });

    } else {
        music.forEach((sound) => {
            sound?.pause();
        });
    }
});
onMounted(() => {
    [
        // '/audio/evening_cafe.mp3',
        {
            link: '/audio/rain.mp3',
            volume: 0.7,
        },
        {
            link: '/audio/evening_cafe.mp3',
            volume: 0.2,
        },
    ].forEach((item) => {
        const audio = new Audio(getStaticLink(item.link));
        audio.loop = true;
        audio.volume = item.volume;
        music.push(audio);
    });

});
</script>
<style scoped lang="scss">
.InterfaceAudio {

}
</style>
