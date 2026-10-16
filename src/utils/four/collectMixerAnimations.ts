import * as THREE from "three";
import { CustomAnimator } from "@/utils/four/CustomAnimator.ts";


export function collectMixerAnimations(animations: THREE.AnimationClip[], item: THREE.Object3D
): THREE.AnimationMixer | null {
    if (!(animations && animations.length)) {
        return null;
    }

    const mixer = new THREE.AnimationMixer(item);

    CustomAnimator.collectAnimatedMaterials(item);

    for (const clip of animations) {
        const action = mixer.clipAction(clip);

        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    }

    return mixer;
}
