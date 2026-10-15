import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { collectMixerAnimations } from "@/utils/four/collectMixerAnimations.ts";

export function createAnimatedModel(gltf: GLTF): { model: THREE.Object3D, mixer: THREE.AnimationMixer | null } {
    const mixer = collectMixerAnimations(gltf.animations, gltf.scene);

    return { model: gltf.scene, mixer };
}
