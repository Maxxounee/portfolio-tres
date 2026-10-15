import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { InstanceItem } from './types';

export function loadAnimatedSkeleton(
    gltf: GLTF,
    item: InstanceItem,
): { clone: THREE.Object3D; mixer: THREE.AnimationMixer } {
    const clone = SkeletonUtils.clone(gltf.scene);

    clone.position.set(...item.position);
    clone.rotation.set(...item.rotation);
    clone.scale.set(...item.scale);

    clone.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    const mixer = new THREE.AnimationMixer(clone);

    for (const clip of gltf.animations) {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    }

    return { clone, mixer };
}
