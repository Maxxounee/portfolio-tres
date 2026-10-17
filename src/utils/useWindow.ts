import { useMediaQuery } from '@vueuse/core';
import { computed, onMounted, onBeforeUnmount, watch } from 'vue';

const isPortrait = useMediaQuery('(orientation: portrait)');
const isMobile = computed(() => isPortrait.value);

let isInitialized = false;

function updateFontSize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = (width * height) / (1920 * 1080);
    const fontSize = Math.round(10 * Math.sqrt(ratio));

    document.documentElement.style.fontSize = `${fontSize}px`;
}

function initDeviceDetection(): void {
    if (isInitialized) {
        return;
    }
    
    isInitialized = true;

    watch(
        isMobile,
        (value) => {
            const body = document.querySelector('body');
            if (!body) return;
            body.classList.remove('device-mobile', 'device-desktop');
            body.classList.add(value ? 'device-mobile' : 'device-desktop');
        },
        { immediate: true }
    );

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
}

export function useWindow() {
    initDeviceDetection();

    return { isMobile };
}
