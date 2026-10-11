import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import * as cityConfig from "@/config/four/city";

export const useCityStore = defineStore('city', () => {
    // state
    const cityViewObjects = ref<cityConfig.CityViewStaticOrForward[]>([]);
    const sceneIsReady = ref(false);

    // actions
    function pushCityViewObjects(arr: cityConfig.CityViewStaticOrForward[]) {
        if (
            cityViewObjects.value.length
            || !arr.length
        ) {
            console.log('City store. cityViewObjects уже заполнен');
            return;
        }

        cityViewObjects.value.push(...arr);
        sceneIsReady.value = true;
    }

    return {
        cityViewObjects,
        sceneIsReady,
        pushCityViewObjects,
    };
});
