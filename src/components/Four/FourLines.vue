<template>
</template>
<script setup>
import { useTres } from "@tresjs/core";
import { onMounted } from "vue";
import * as THREE from 'three';
import { gsap } from 'gsap';

const { scene } = useTres();
let createCarPos = true;

function mathRandom(num = 8) {
    return -Math.random() * num + Math.random() * num;
};
var createCars = function (cScale = 2, cPos = 20, cColor = 0xFFFF00) {
    var cMat = new THREE.MeshToonMaterial({ color: cColor, side: THREE.DoubleSide });
    var cGeo = new THREE.BoxGeometry(1, cScale / 40, cScale / 40);
    var cElem = new THREE.Mesh(cGeo, cMat);
    var cAmp = 0.1;

    if (createCarPos) {
        createCarPos = false;
        // cElem.position.x = -cPos;
        // cElem.position.z = (mathRandom(cAmp));
        //
        // gsap.to(
        //     cElem.position,
        //     3,
        //     {
        //         x: cPos,
        //         repeat: -1,
        //         yoyo: true,
        //         delay: mathRandom(3)
        //     }
        // );
    } else {
        createCarPos = true;
        cElem.position.x = (mathRandom(cAmp));
        cElem.position.z = -cPos;
        cElem.rotation.y = 90 * Math.PI / 180;

        gsap.to(cElem.position, 5, {
            z: cPos,
            repeat: -1,
            yoyo: true,
            delay: mathRandom(3),
            ease: 'Power1.inOut'
        });
    }
    cElem.receiveShadow = true;
    cElem.castShadow = true;
    cElem.position.y = Math.abs(mathRandom(5));
    scene.value.add(cElem);
};

onMounted(() => {
    for (var i = 0; i < 60; i++) {
        createCars(0.1, 20);
    }
})
</script>
<style lang="scss" scoped>
</style>
