import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { InstanceItem } from './types';
import { collectMixerAnimations } from "@/utils/four/collectMixerAnimations.ts";

export function createAnimatedSkeleton(gltf: GLTF, item: InstanceItem): {
    model: THREE.Object3D;
    mixer: THREE.AnimationMixer | null
} {
    const clone = SkeletonUtils.clone(gltf.scene);

    clone.position.set(...item.position);
    clone.rotation.set(...item.rotation);
    clone.scale.set(...item.scale);

    clone.traverse((obj: THREE.Object3D | THREE.Mesh) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    const mixer = collectMixerAnimations(gltf.animations, clone);

    return { model: clone, mixer };
}
