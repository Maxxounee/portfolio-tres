import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', () => {
    const isDebug = false;

    return {
        isDebug,
    };
});
