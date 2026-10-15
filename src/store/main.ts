import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const isDebug = false;
    const noirMode = ref(true);
    const noTextMode = ref(false);
    const musicOn = ref(false);

    function toggleNoirMode() {
        noirMode.value = !noirMode.value;
    }

    function toggleTextMode() {
        noTextMode.value = !noTextMode.value;
    }

    function toggleMusicMode() {
        musicOn.value = !musicOn.value;
    }

    return {
        noirMode,
        isDebug,
        noTextMode,
        musicOn,
        toggleNoirMode,
        toggleTextMode,
        toggleMusicMode,
    };
});
