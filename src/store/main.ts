import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', () => {
    const isDebug = false;
    const isDev = true;

    return {
        isDebug,
        isDev,
    };
});
