<template>
    <div class="FourWrapper">
        <TresCanvas
            class="FourWrapper__scene"
            window-size
            shadows
        >
            <FourDevCamera
                v-if="mainStore.isDebug"
            />
            <FourPerspectiveCamera
                ref="cameraRef"
            />
            <!--            <FourCity-->
            <!--                @loaded="({ cityNodes }) => init(cityNodes)"-->
            <!--            />-->
            <FourCityTest
                @loaded="({ nodes }) => init(nodes)"
            />
            <FourBuildingTest/>
            <FourFog/>
            <!--            <FourCharacter ref="character"/>-->
            <FourLights/>
            <FourFloor/>
            <FourEffectComposer v-if="true"/>
        </TresCanvas>
        <!--        <TresCanvas-->
        <!--            v-if="!mainStore.isDebug"-->
        <!--            alpha-->
        <!--            :clear-alpha="0"-->
        <!--            class="FourWrapper__ui"-->
        <!--        >-->
        <!--            <FourControls-->
        <!--                @click="setCameraView"-->
        <!--            />-->
        <!--        </TresCanvas>-->
        <!-- interface -->
        <InterfaceWrapper/>
        <InterfaceAudio/>
        <InterfacePreloader
            v-if="!isDev"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, } from 'vue';
import { TresCanvas, useTres } from '@tresjs/core';
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
import InterfaceWrapper from "@/components/Interface/InterfaceWrapper.vue";
import InterfacePreloader from "@/components/Interface/InterfacePreloader.vue";
import InterfaceAudio from "@/components/Interface/InterfaceAudio.vue";


const mainStore = useMainStore();
const cityStore = useCityStore();
const cameraRef = ref<InstanceType<typeof ThreePerspectiveCamera> | null>(null);
const isDev = import.meta.env.DEV;

function init(cityNodes) {
    if (!cityNodes || !Object.keys(cityNodes).length) {
        console.error('FourWrapper.init()');
        return;
    }

    const staticConfig = cityConfig.cameraMode.static;
    const forwardConfig = cityConfig.cameraMode.forward;


    const getForwardValues = (conf): cityConfig.CityViewForwardArg => {
        const obj = cityNodes[conf.modelName];

        if (!obj) {
            console.error(`FourWrapper.init(). Модель "${conf.modelName} не найдена"`);
        }

        return { ...conf, obj };
    };

    const handleConfigItem = (item) => {
        if (item.pos && item.target) {
            return new cityConfig.CityViewStatic(item);
        } else if (item.modelName) {
            return new cityConfig.CityViewForward(getForwardValues(item));
        } else {
            console.warn('[fourWrapper.handleConfigItem] вронг айтем');
        }
    };

    const arr: cityConfig.CityViewStaticOrForward[] = [
        // handleConfigItem(staticConfig.test),
        
        handleConfigItem(staticConfig.welcome),
        handleConfigItem(staticConfig.tech),
        handleConfigItem(staticConfig.works),
        handleConfigItem(forwardConfig.about),
        handleConfigItem(staticConfig.repo),
        handleConfigItem(forwardConfig.contacts),
    ];

    arr.forEach((item) => {
        item.apply = () => cityStore.setView(item);
    });

    cityStore.pushCityViewObjects(arr);

    arr[0].apply();
}
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
