<template>
    <Suspense>
        <EffectComposerPmndrs>
            <!--            <TiltShiftPmndrs-->
            <!--                :focus-area="0.9"-->
            <!--                :feather="0.2"-->
            <!--            />-->
            <NoisePmndrs
                premultiply
                :blend-function="BlendFunction.SCREEN"
            />
            <ColorAveragePmndrs
                v-if="mainStore.noirMode"
            />
            <ScanlinePmndrs
                :density="3"
                :opacity="0.3"
                :scroll-speed="0.01"
            />
            <BloomPmndrs
                :strength="0.6"
                :radius="0.7"
                :threshold="0.8"
            />
        </EffectComposerPmndrs>
    </Suspense>
</template>
<script setup lang="ts">
import {
    EffectComposerPmndrs,
    NoisePmndrs,
    ScanlinePmndrs,
    TiltShiftPmndrs,
    BloomPmndrs,
    ColorAveragePmndrs
} from "@tresjs/post-processing";
import { BlendFunction } from 'postprocessing';
import { useMainStore } from "@/store/main.ts";

const mainStore = useMainStore();
</script>
<style scoped lang="scss">
.FourEffectComposer {

}
</style>
