import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import * as cityConfig from "@/config/four/city";

export const useCityStore = defineStore('city', () => {
    // state
    const cityViewObjects = ref<cityConfig.CityViewStaticOrForward[]>([]);
    const sceneIsReady = ref(false);
    const currentView = shallowRef<cityConfig.CityViewStaticOrForward | null>(null);
    const totalModelsCount = ref(1);
    const totalModelsLoaded = ref(0);


    // ----------------- get

    const totalModelsLoadedPercent = computed<number>(() => {
        return (totalModelsLoaded.value / totalModelsCount.value).toFixed(2);
    });

    // ----------------- actions
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

    function incrementTotalModels() {
        totalModelsLoaded.value++;
    }

    // ----------------- set

    function setView(view: cityConfig.CityViewStaticOrForward): void {
        currentView.value = view;
    }

    function setTotalModelsCount(count: number) {
        totalModelsCount.value = count;
    }


    return {
        cityViewObjects,
        sceneIsReady,
        currentView,
        setView,
        pushCityViewObjects,

        incrementTotalModels,
        setTotalModelsCount,
        totalModelsLoadedPercent,
    };
});
