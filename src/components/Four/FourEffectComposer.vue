<template>
    <Suspense>
        <EffectComposerPmndrs>
            <TiltShiftPmndrs
                :focus-area="0.9"
                :feather="0.2"
            />
            <NoisePmndrs
                premultiply
                :blend-function="BlendFunction.SCREEN"
            />
            <ColorAveragePmndrs/>
            <ScanlinePmndrs
                :density="10"
                :opacity="0.3"
                :scroll-speed="0.01"
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
    ColorAveragePmndrs
} from "@tresjs/post-processing";
import { BlendFunction } from 'postprocessing';
</script>
<style scoped lang="scss">
.FourEffectComposer {

}
</style>
