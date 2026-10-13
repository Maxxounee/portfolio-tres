import { defineStore } from 'pinia';
import { ref, computed, shallowRef } from 'vue';
import * as cityConfig from "@/config/four/city";
import { increment } from "@/utils/utils.ts";
import type { CityViewStaticOrForward } from "@/config/four/city";

export const useCityStore = defineStore('city', () => {
    // state
    const cityViewObjects = ref<cityConfig.CityViewStaticOrForward[]>([]);
    const sceneIsReady = ref(false);
    const currentView = shallowRef<cityConfig.CityViewStaticOrForward | null>(null);
    const totalModelsCount = ref(1);
    const totalModelsLoaded = ref(0);


    // ----------------- get

    const totalModelsLoadedPercent = computed<number>((): number => {
        return Number((totalModelsLoaded.value / totalModelsCount.value).toFixed(2));
    });

    const isLoaded = computed(() => {
        return totalModelsLoadedPercent.value > 0.99;
    });

    // ----------------- actions
    function pushCityViewObjects(arr: cityConfig.CityViewStaticOrForward[]) {
        if (cityViewObjects.value.length || !arr.length) {
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

    function nextView() {
        const curIndex = cityViewObjects.value.findIndex((item) => {
            if (!currentView.value) {
                return;
            }

            return item.id === currentView.value.id;
        });
        const nextIndex = increment(curIndex + 1, 0, cityViewObjects.value.length - 1);

        if (cityViewObjects.value[nextIndex]) {
            setView(cityViewObjects.value[nextIndex]);
        }

        // console.log(curIndex);
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
        isLoaded,
        nextView,
    };
});
