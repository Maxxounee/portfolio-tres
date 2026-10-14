<template>
    <TresPerspectiveCamera
        ref="cameraRef"
        :fov="75"
        :near="0.1"
        :far="1000"
    />
</template>
<script setup lang="ts">
import { useLoop } from '@tresjs/core';
import type { TresInstance } from '@tresjs/core';
import { computed, ref, shallowRef, watch } from 'vue';
import { gsap } from 'gsap';
import * as THREE from 'three';
import * as cityConfig from '@/config/four/city';
import { useCityStore } from '@/store/city';

const cameraRef = shallowRef<TresInstance | null>(null);

const camera = computed<THREE.PerspectiveCamera | null>(() => {
    const value: unknown = cameraRef.value;
    return value instanceof THREE.PerspectiveCamera ? value : null;
});

const cityStore = useCityStore();
const { onBeforeRender } = useLoop();

let isTransitioning = false;
let staticStartTime = 0;
let hasPrev = false;

const carWorldPos = new THREE.Vector3();
const prevPos = new THREE.Vector3();
const movementDir = new THREE.Vector3(0, 0, -1);
const _shiftDir = new THREE.Vector3();
const newDir = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();

const _tmpMatrix = new THREE.Matrix4();
const _tmpQuat = new THREE.Quaternion();
const _tmpUp = new THREE.Vector3(0, 1, 0);
const _box = new THREE.Box3();

let currentTl: gsap.core.Timeline | null = null;
_shiftDir.crossVectors(movementDir, _tmpUp).normalize();

const emit = defineEmits(['flyEnd']);
let isFirstPosition = true;

function computeLookAtQuaternion(fromPos: THREE.Vector3, toPos: THREE.Vector3, out: THREE.Quaternion): void {
    _tmpMatrix.lookAt(fromPos, toPos, _tmpUp);
    out.setFromRotationMatrix(_tmpMatrix);
}


watch(
    () => [cityStore.sceneIsReady, cityStore.currentView],
    ([isReady, view]) => {
        if (!isReady) return;

        if (!view) {
            console.error('[FourPerspectiveCamera] Нет currentView');
            return;
        }

        handleView(view, isFirstPosition);

        isFirstPosition = false;
    },
);


function renderForward(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewForward,): void {
    const positionLerp = 0.05;
    const rotationLerp = 0.05;
    const obj = conf.obj;

    if (!obj) return;


    obj.updateMatrixWorld(true);
    _box.setFromObject(obj);
    _box.getCenter(carWorldPos);

    if (hasPrev) {
        newDir.subVectors(carWorldPos, prevPos);
        if (newDir.lengthSq() > 1e-6) {
            newDir.normalize();
            movementDir.lerp(newDir, conf.dirSmoothing).normalize();
        }
    }
    prevPos.copy(carWorldPos);
    hasPrev = true;

    _shiftDir.crossVectors(movementDir, _tmpUp).normalize();

    const SIDE_OFFSET = conf.sideOffset ?? -0.8;

    desiredPosition.copy(carWorldPos);
    desiredPosition.addScaledVector(movementDir, -conf.followDistance);
    desiredPosition.addScaledVector(_shiftDir, SIDE_OFFSET);
    desiredPosition.y += conf.followHeight;

    desiredLookAt.copy(carWorldPos);
    desiredLookAt.addScaledVector(movementDir, 1);
    desiredLookAt.addScaledVector(_shiftDir, SIDE_OFFSET * 0.5);   // ← чуть сбоку
    desiredLookAt.y += conf.followLookAtHeight;

    cam.position.lerp(desiredPosition, positionLerp);
    computeLookAtQuaternion(cam.position, desiredLookAt, _tmpQuat);
    cam.quaternion.slerp(_tmpQuat, rotationLerp);
}

function renderStatic(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewStatic, elapsed): void {
    const positionLerp = 0.1;

    const fadeInDuration = 1.5;
    const fadeIn = Math.min(elapsed / fadeInDuration, 1);

    const height = Math.max(cam.position.y - conf.target.y, 0);

    const posAmp = (0.01 + height * height / 1000) * fadeIn;

    desiredPosition.copy(conf.pos);
    desiredPosition.x += Math.sin(elapsed * 0.7) * posAmp;
    desiredPosition.y += Math.cos(elapsed * 1.1) * posAmp;
    desiredPosition.z += Math.sin(elapsed * 0.5) * posAmp;

    cam.position.lerp(desiredPosition, positionLerp);
}

function flyTo(targetPosition: THREE.Vector3, targetTarget: THREE.Vector3, onComplete?: () => void, immediate: boolean = false): void {
    const cam = camera.value;
    if (!cam) return;

    const transitionDuration = 1.2;
    const transitionEase = 'power2.inOut';

    computeLookAtQuaternion(targetPosition, targetTarget, _tmpQuat);

    const targetQuat = _tmpQuat.clone();

    if (immediate) {
        cam.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        cam.quaternion.set(targetQuat.x, targetQuat.y, targetQuat.z, targetQuat.w);

        onComplete?.();
        return;
    }

    currentTl?.kill();

    currentTl = gsap.timeline({
        onComplete: () => {
            emit('flyEnd');
            onComplete?.();
        },
    });

    currentTl.to(cam.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: transitionDuration,
        ease: transitionEase,
    }, 0);

    currentTl.to(cam.quaternion, {
        x: targetQuat.x,
        y: targetQuat.y,
        z: targetQuat.z,
        w: targetQuat.w,
        duration: transitionDuration,
        ease: transitionEase,
    }, 0);
}

function handleView(conf: cityConfig.CityViewStaticOrForward | undefined, immediate: boolean = false): void {
    if (!conf) return;

    if (conf instanceof cityConfig.CityViewStatic) {
        isTransitioning = true;
        flyTo(conf.pos, conf.target, () => {
            staticStartTime = performance.now();
            isTransitioning = false;
        }, immediate);
    } else if (conf instanceof cityConfig.CityViewForward) {
        hasPrev = false;
        isTransitioning = false;
        movementDir.set(0, 0, -1);
    }
}

onBeforeRender((ctx) => {
    if (isTransitioning) return;

    const cam = camera.value;
    if (!cam) return;

    if (cityStore.currentView instanceof cityConfig.CityViewForward) {
        renderForward(cam, cityStore.currentView);
    } else if (cityStore.currentView instanceof cityConfig.CityViewStatic) {
        renderStatic(cam, cityStore.currentView, ctx.elapsed);
    }
});

defineExpose({});
</script>
