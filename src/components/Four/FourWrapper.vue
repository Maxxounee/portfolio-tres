<template>
    <div class="FourWrapper">
        <TresCanvas
            class="FourWrapper__scene"
            :clear-color="cityConfig.colors.background"
            window-size
            shadows
        >
            <FourDevCamera
                v-if="mainStore.isDev"
            />
            <FourPerspectiveCamera
                ref="cameraRef"
            />
            <FourCity
                @loaded="({ cityNodes }) => init(cityNodes)"
            />
            <FourCityTest/>
            <FourFog/>
            <FourBuildingTest/>
            <FourCharacter ref="character"/>
            <FourLights/>
            <FourFloor/>
            <FourEffectComposer v-if="true"/>
        </TresCanvas>
        <TresCanvas
            v-if="!mainStore.isDev"
            alpha
            :clear-alpha="0"
            class="FourWrapper__ui"
        >
            <FourControls
                @click="setCameraView"
            />
        </TresCanvas>
    </div>
</template>
<script setup lang="ts">
import { ref, } from 'vue';
import { TresCanvas } from '@tresjs/core';
import ThreePerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourCharacter from "@/components/Four/FourCharacter.vue";
import FourLights from "@/components/Four/FourLights.vue";
import FourPerspectiveCamera from "@/components/Four/FourPerspectiveCamera.vue";
import FourControls from "@/components/Four/Controls/FourControls.vue";
import FourCity from "@/components/Four/FourCity.vue";
import FourBuildingTest from "@/components/Four/FourBuildingTest.vue";
import FourDevCamera from "@/components/Four/FourDevCamera.vue";
import FourFog from "@/components/Four/FourFog.vue";
import FourFloor from "@/components/Four/FourFloor.vue";
import FourEffectComposer from "@/components/Four/FourEffectComposer.vue";
import * as cityConfig from "@/config/four/city";
import { useCityStore } from "@/store/city";
import { useMainStore } from "@/store/main";
import FourCityTest from "@/components/Four/FourCityTest.vue";


const mainStore = useMainStore();
const cityStore = useCityStore();
const cameraRef = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);

function init(cityNodes) {
    if (!cityNodes || !Object.keys(cityNodes).length) {
        console.error('FourWrapper.init()');
        return;
    }

    const staticConfig = cityConfig.cameraMode.static;
    const forwardConfig = cityConfig.cameraMode.forward;


    const getStaticValues = (conf): cityConfig.CityViewStaticArg => {
        return { ...conf };
    };

    const getForwardValues = (conf): cityConfig.CityViewForwardArg => {
        const obj = cityNodes[conf.modelName];

        if (!obj) {
            console.error(`FourWrapper.init(). Модель "${conf.modelName} не найдена"`);
        }

        return { ...conf, obj };
    };

    const arr: cityConfig.CityViewStaticOrForward[] = [
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.welcome),
        }),
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.one),
        }),
        new cityConfig.CityViewStatic({
            ...getStaticValues(staticConfig.two),
        }),
        new cityConfig.CityViewForward({
            ...getForwardValues(forwardConfig.one),
        }),
    ];

    cityStore.pushCityViewObjects(arr);

    if (cameraRef.value) {
        cameraRef.value.setView(arr[0]);

    }
}

const setCameraView = (configIndex: number): void => {
    cameraRef.value.setView(cityStore.cityViewObjects[configIndex]);
};
</script>
<style scoped lang="scss">
.FourWrapper {
    @include div100();
    background: var(--ccc);

    .controls {
        position: fixed;
        display: flex;
        left: 0;
        bottom: 0;
        width: 100px;
        gap: 10px;
    }

    &__scene {

    }

    &__ui {
        pointer-events: none;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 140px;
    }
}
</style>
