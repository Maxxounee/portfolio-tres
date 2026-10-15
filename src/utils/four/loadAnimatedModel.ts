import type { CityBuildResult } from "@/utils/four/types.ts";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadAnimatedModel(gltf: GLTF, result: CityBuildResult,): THREE.Object3D {
    const mixer = new THREE.AnimationMixer(gltf.scene);

    for (const clip of gltf.animations) {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    }

    result.mixers.push(mixer);
    return gltf.scene;
}
