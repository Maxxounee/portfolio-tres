<template>
    <div class="InterfaceFunctions">
        <InterfaceCheckbox
            text="noir"
            :active="mainStore.noirMode"
            @change="mainStore.toggleNoirMode()"
        />
        <InterfaceCheckbox
            text="text"
            :active="!mainStore.noTextMode"
            @change="mainStore.toggleTextMode()"
        />
        <InterfaceCheckbox
            text="sound"
            :active="mainStore.musicOn"
            @change="mainStore.toggleMusicMode()"
        />
        <InterfaceCheckbox
            text="day"
            :active="mainStore.dayMode"
            @change="mainStore.toggleDayMode()"
        />
    </div>
</template>
<script setup lang="ts">
import InterfaceCheckbox from "@/components/Interface/InterfaceCheckbox.vue";
import { useMainStore } from "@/store/main.ts";

const mainStore = useMainStore();
</script>
<style scoped lang="scss">
.InterfaceFunctions {
    @include flexColumn();
    gap: 3rem;
    position: absolute;
    top: var(--T);
    left: var(--L);
    pointer-events: auto;
}
</style>
