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
import { computed, ref, shallowRef, watch } from 'vue';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { TresInstance } from '@tresjs/core';
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

const currentView = ref<cityConfig.CityViewStaticOrForward>();


const carWorldPos = new THREE.Vector3();
const prevPos = new THREE.Vector3();
const movementDir = new THREE.Vector3(0, 0, -1);
const newDir = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();


watch(
    () => [cityStore.sceneIsReady, currentView.value],
    ([isReady, view]) => {
        if (!isReady) return;

        if (!view) {
            console.error('FourPerspectiveCamera.watch. Нет currentView');
            return;
        }

        handleView(view);
    },
);

function renderForward(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewForward): void {
    const positionLerp = 0.05;
    const rotationLerp = 0.05;
    const obj = conf.obj;

    if (!obj) return;

    obj.getWorldPosition(carWorldPos);

    if (hasPrev) {
        newDir.subVectors(carWorldPos, prevPos);
        if (newDir.lengthSq() > 1e-6) {
            newDir.normalize();
            movementDir.lerp(newDir, conf.dirSmoothing).normalize();
        }
    }

    prevPos.copy(carWorldPos);
    hasPrev = true;

    desiredPosition.copy(carWorldPos);
    desiredPosition.addScaledVector(movementDir, -conf.followDistance);
    desiredPosition.y += conf.followHeight;

    desiredLookAt.copy(carWorldPos);
    desiredLookAt.addScaledVector(movementDir, 1);
    desiredLookAt.y += conf.followHeight;

    cam.position.lerp(desiredPosition, positionLerp);

    const tmp = new THREE.PerspectiveCamera();
    tmp.position.copy(cam.position);
    tmp.lookAt(desiredLookAt);
    cam.quaternion.slerp(tmp.quaternion, rotationLerp);
}

function renderStatic(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewStatic): void {
    const positionLerp = 0.1;
    const rotationLerp = 0.1;

    const elapsed = (performance.now() - staticStartTime) / 1000;

    const fadeInDuration = 1.5;
    const fadeIn = Math.min(elapsed / fadeInDuration, 1);

    const posAmp = 0.15 * fadeIn;
    desiredPosition.copy(conf.pos);
    desiredPosition.x += Math.sin(elapsed * 0.7) * posAmp;
    desiredPosition.y += Math.cos(elapsed * 1.1) * posAmp;
    desiredPosition.z += Math.sin(elapsed * 0.5) * posAmp;

    const lookAmp = 0.13 * fadeIn;
    desiredLookAt.copy(conf.lookAt);
    desiredLookAt.x += Math.sin(elapsed * 0.9) * lookAmp;
    desiredLookAt.y += Math.cos(elapsed * 0.6) * lookAmp;

    cam.position.lerp(desiredPosition, positionLerp);

    const tmp = new THREE.PerspectiveCamera();
    tmp.position.copy(cam.position);
    tmp.lookAt(desiredLookAt);

    tmp.rotateZ(Math.sin(elapsed * 0.4) * 0.005 * fadeIn);

    cam.quaternion.slerp(tmp.quaternion, rotationLerp);
}


function flyTo(targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3, onComplete?: () => void): void {
    const cam = camera.value;
    const transitionDuration = 1.2;
    const transitionEase = 'power2.inOut';

    if (!cam) return;

    const tmp = new THREE.PerspectiveCamera();
    tmp.position.copy(targetPosition);
    tmp.lookAt(targetLookAt);

    const tl = gsap.timeline({
        onComplete: () => {
            onComplete?.();
        },
    });

    tl.to(cam.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: transitionDuration,
        ease: transitionEase,
    }, 0);

    tl.to(cam.quaternion, {
        x: tmp.quaternion.x,
        y: tmp.quaternion.y,
        z: tmp.quaternion.z,
        w: tmp.quaternion.w,
        duration: transitionDuration,
        ease: transitionEase,
    }, 0);
}


function handleView(conf: cityConfig.CityViewStaticOrForward | undefined): void {
    if (conf instanceof cityConfig.CityViewStatic) {
        isTransitioning = true;

        flyTo(conf.pos, conf.lookAt, () => {
            staticStartTime = performance.now();
            isTransitioning = false;
        });
    } else if (conf instanceof cityConfig.CityViewForward) {
        hasPrev = false;
        isTransitioning = false;
    }
}


function setView(conf: cityConfig.CityViewStaticOrForward): void {
    currentView.value = conf;
}

onBeforeRender(() => {
    if (isTransitioning) return;

    const cam = camera.value;

    if (!cam) return;

    if (currentView.value instanceof cityConfig.CityViewForward) {
        renderForward(cam, currentView.value);
    } else if (currentView.value instanceof cityConfig.CityViewStatic) {
        renderStatic(cam, currentView.value);
    }
});


defineExpose({
    setView,
});
</script>
