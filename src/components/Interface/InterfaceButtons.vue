<template>
    <div class="InterfaceButtons">
        <div class="InterfaceButtons__container">
            <InterfaceButtonsItem
                v-for="(obj, i) in cityViewObjects"
                :text="obj.html.button"
                :active="obj.id === currentView.id"
                :key="i"
                @click="() => obj.apply()"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCityStore } from "@/store/city.ts";
import InterfaceButtonsItem from "@/components/Interface/InterfaceButtonsItem.vue";
import { storeToRefs } from "pinia";

const cityStore = useCityStore();
const { cityViewObjects, currentView } = storeToRefs(cityStore);
</script>
<style scoped lang="scss">
.InterfaceButtons {
    @include div100;

    &__container {
        @include flexColumn(start, center);
        gap: 3rem;
        padding: 0 0 4rem 4rem;
        position: absolute;
        bottom: 0;
        width: 100%;
    }
}
</style>
