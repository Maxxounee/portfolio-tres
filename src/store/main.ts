import { defineStore } from 'pinia';
import { ref } from "vue";

export const useMainStore = defineStore('main', () => {
    const isDebug = false;
    const noirMode = ref(false);

    function toggleNoirMode() {
        noirMode.value = !noirMode.value;
    }

    return {
        noirMode,
        isDebug,
        toggleNoirMode,
    };
});
