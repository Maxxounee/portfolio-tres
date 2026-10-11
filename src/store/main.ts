import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', () => {
    const isDev = false;

    return {
        isDev,
    };
});
