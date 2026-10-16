import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const isDebug = false;
    const noirMode = ref(true);
    const noTextMode = ref(false);
    const musicOn = ref(false);
    const dayMode = ref(false);
    const preloaderHidden = ref(false);

    function toggleNoirMode() {
        noirMode.value = !noirMode.value;
    }

    function toggleTextMode() {
        noTextMode.value = !noTextMode.value;
    }

    function toggleMusicMode() {
        musicOn.value = !musicOn.value;
    }

    function toggleDayMode() {
        dayMode.value = !dayMode.value;
    }

    function hidePreloader() {
        preloaderHidden.value = true;

    }

    return {
        noirMode,
        isDebug,
        noTextMode,
        musicOn,
        dayMode,
        preloaderHidden,
        toggleNoirMode,
        toggleTextMode,
        toggleMusicMode,
        toggleDayMode,
        hidePreloader,
    };
});
