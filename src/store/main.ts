import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const isDebug = true;
    const noirMode = ref(false);
    const noTextMode = ref(false);

    function toggleNoirMode() {
        noirMode.value = !noirMode.value;
    }

    function toggleTextMode() {
        noTextMode.value = !noTextMode.value;
    }

    return {
        noirMode,
        isDebug,
        noTextMode,
        toggleNoirMode,
        toggleTextMode,
    };
});
