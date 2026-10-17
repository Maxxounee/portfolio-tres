<template>
    <TresPerspectiveCamera
        ref="cameraRef"
        :fov="30"
        :near="0.1"
        :far="1000"
    />
</template>
<script setup lang="ts">
import { useLoop } from '@tresjs/core';
import type { TresInstance } from '@tresjs/core';
import { computed, shallowRef, watch } from 'vue';
import { gsap } from 'gsap';
import * as THREE from 'three';
import * as cityConfig from '@/config/four/city';
import { useCityStore } from '@/store/city';
import { degToRad } from 'three/src/math/MathUtils';

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
const newDir = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();
const desiredLookAt = new THREE.Vector3();

const _shiftDir = new THREE.Vector3();
const _rotatedDir = new THREE.Vector3();
const _rotationQuat = new THREE.Quaternion();
const _tmpMatrix = new THREE.Matrix4();
const _tmpQuat = new THREE.Quaternion();
const _tmpUp = new THREE.Vector3(0, 1, 0);
const _targetQuat = new THREE.Quaternion();
const _startQuat = new THREE.Quaternion();
const forwardRenderBodyCache = new Map<THREE.Object3D, THREE.Object3D>();

let currentTl: gsap.core.Timeline | null = null;

_shiftDir.crossVectors(movementDir, _tmpUp).normalize();

let isFirstPosition = true;

function computeLookAtQuaternion(fromPos: THREE.Vector3, toPos: THREE.Vector3, out: THREE.Quaternion): void {
    _tmpMatrix.lookAt(fromPos, toPos, _tmpUp);
    out.setFromRotationMatrix(_tmpMatrix);
}

watch(
    () => [cityStore.sceneIsReady, cityStore.currentView],
    ([isReady, view]) => {
        if (!isReady || !view) {
            return;
        }

        handleView(view, isFirstPosition);
        isFirstPosition = false;
    },
);

function renderForward(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewForward, ctx): void {
    const positionLerp = 0.05;
    const rotationLerp = 0.05;
    const obj = conf.obj;

    if (!obj) return;

    let body = forwardRenderBodyCache.get(obj);

    if (!body) {
        obj.traverse((child) => {
            if (body) {
                return;
            }
            if (child.name.startsWith('body')) {
                body = child;
            }
        });
        if (!body) {
            return;
        }

        forwardRenderBodyCache.set(obj, body);
    }

    body.updateMatrixWorld(true);
    body.getWorldPosition(carWorldPos);

    if (hasPrev) {
        newDir.subVectors(carWorldPos, prevPos);
        newDir.y = 0;

        if (newDir.lengthSq() > 1e-6) {
            newDir.normalize();
            movementDir.lerp(newDir, conf.dirSmoothing);
        }
    }

    prevPos.copy(carWorldPos);
    hasPrev = true;

    const angle = degToRad(conf.followAngle);

    _rotationQuat.setFromAxisAngle(_tmpUp, angle);
    _rotatedDir.copy(movementDir).applyQuaternion(_rotationQuat);

    _shiftDir.crossVectors(_rotatedDir, _tmpUp).normalize();

    desiredPosition.copy(carWorldPos);
    desiredPosition.addScaledVector(_rotatedDir, -conf.followDistance);
    desiredPosition.addScaledVector(_shiftDir, conf.sideOffset ?? 0);
    desiredPosition.y += conf.followHeight;

    desiredLookAt.copy(carWorldPos);
    desiredLookAt.addScaledVector(_rotatedDir, 1);
    desiredLookAt.addScaledVector(_shiftDir, (conf.sideOffset ?? 0) * 0.5);
    desiredLookAt.y += conf.followLookAtHeight;

    const t = 1 - Math.pow(1 - positionLerp, ctx.delta * 60);

    cam.position.lerp(desiredPosition, t);
    computeLookAtQuaternion(cam.position, desiredLookAt, _tmpQuat);
    cam.quaternion.slerp(_tmpQuat, rotationLerp);
    cam.quaternion.normalize();
}

function renderStatic(cam: THREE.PerspectiveCamera, conf: cityConfig.CityViewStatic): void {
    const positionLerp = 0.1;
    const fadeInDuration = 1.5;
    const elapsed = (performance.now() - staticStartTime) / 1000;
    const fadeIn = Math.min(elapsed / fadeInDuration, 1);

    const height = Math.max(cam.position.y - conf.target.y, 0);
    const posAmp = (0.01 + height * height / 5000) * fadeIn;

    desiredPosition.copy(conf.pos);
    desiredPosition.x += Math.sin(elapsed * 0.7) * posAmp;
    desiredPosition.y += Math.cos(elapsed * 1.1) * posAmp;
    desiredPosition.z += Math.sin(elapsed * 0.5) * posAmp;

    cam.position.lerp(desiredPosition, positionLerp);

    computeLookAtQuaternion(cam.position, conf.target, _tmpQuat);
    cam.quaternion.slerp(_tmpQuat, 0.1);
    cam.quaternion.normalize();
}

function flyTo(
    targetPosition: THREE.Vector3,
    targetTarget: THREE.Vector3,
    onComplete?: () => void,
    immediate = false,
): void {
    const cam = camera.value;
    if (!cam) return;

    const transitionDuration = 1.2;
    const transitionEase = 'power2.inOut';

    computeLookAtQuaternion(targetPosition, targetTarget, _targetQuat);
    _startQuat.copy(cam.quaternion);

    if (immediate) {
        cam.position.copy(targetPosition);
        cam.quaternion.copy(_targetQuat);
        onComplete?.();
        return;
    }

    currentTl?.kill();
    currentTl?.clear();
    currentTl = null;

    const progress = { value: 0 };

    currentTl = gsap.timeline({
        onUpdate: () => {
            cam.quaternion.slerpQuaternions(_startQuat, _targetQuat, progress.value);
            cam.quaternion.normalize();
        },
        onComplete: () => {
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

    currentTl.to(progress, {
        value: 1,
        duration: transitionDuration,
        ease: transitionEase,
    }, 0);
}

function handleView(conf: cityConfig.CityViewStaticOrForward | undefined, immediate = false): void {
    if (!conf) return;

    if (conf instanceof cityConfig.CityViewStatic) {
        isTransitioning = true;
        flyTo(
            conf.pos,
            conf.target,
            () => {
                staticStartTime = performance.now();
                isTransitioning = false;
            },
            immediate,
        );
    } else {
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
        renderForward(cam, cityStore.currentView, { delta: 1 / 60 });
    } else if (cityStore.currentView instanceof cityConfig.CityViewStatic) {
        renderStatic(cam, cityStore.currentView);
    }
});
</script>
