import type * as THREE from 'three';

export type Vec3 = [number, number, number]

export interface InstanceItem {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
}

export type SceneJson = Record<string, InstanceItem[]>

export interface CityBuildResult {
    instancedMeshes: THREE.InstancedMesh[];
    animatedChars: THREE.Object3D[];
    animatedCars: THREE.Object3D[];
    mixers: THREE.AnimationMixer[];
}
