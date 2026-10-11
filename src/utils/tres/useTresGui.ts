import { onMounted, onBeforeUnmount, type Ref } from 'vue';
import GUI from 'lil-gui';
import * as THREE from 'three';
import type { TresInstance } from '@tresjs/core';

export function useTresGui({ cameraRef }: { cameraRef: Ref<TresInstance | null> }) {
    const gui = new GUI({ title: 'Debug' });

    let initialized = false;
    let animationId = 0;

    // Реактивный «снимок» значений для lil-gui
    const state = {
        posX: 0,
        posY: 0,
        posZ: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        dirX: 0,
        dirY: 0,
        dirZ: 0,
    };

    const _dir = new THREE.Vector3();

    const initGui = (cam: TresInstance) => {
        if (initialized) return;
        initialized = true;

        const folder = gui.addFolder('Camera');

        // --- Position (управляемое) ---
        folder.add(state, 'posX', -10, 10, 0.1).name('Pos X').listen()
            .onChange((v: number) => {
                cam.position.x = v;
            });
        folder.add(state, 'posY', -10, 10, 0.1).name('Pos Y').listen()
            .onChange((v: number) => {
                cam.position.y = v;
            });
        folder.add(state, 'posZ', -10, 10, 0.1).name('Pos Z').listen()
            .onChange((v: number) => {
                cam.position.z = v;
            });

        // --- Rotation (read-only) ---
        const rotFolder = folder.addFolder('Rotation (°)');
        rotFolder.add(state, 'rotX').name('X').disable().listen();
        rotFolder.add(state, 'rotY').name('Y').disable().listen();
        rotFolder.add(state, 'rotZ').name('Z').disable().listen();

        // --- Direction (read-only) ---
        const dirFolder = folder.addFolder('Direction (look)');
        dirFolder.add(state, 'dirX').name('Dir X').disable().listen();
        dirFolder.add(state, 'dirY').name('Dir Y').disable().listen();
        dirFolder.add(state, 'dirZ').name('Dir Z').disable().listen();
    };

    const sync = (cam: TresInstance) => {
        state.posX = +cam.position.x.toFixed(3);
        state.posY = +cam.position.y.toFixed(3);
        state.posZ = +cam.position.z.toFixed(3);

        state.rotX = +THREE.MathUtils.radToDeg(cam.rotation.x).toFixed(1);
        state.rotY = +THREE.MathUtils.radToDeg(cam.rotation.y).toFixed(1);
        state.rotZ = +THREE.MathUtils.radToDeg(cam.rotation.z).toFixed(1);

        cam.getWorldDirection(_dir);
        state.dirX = +_dir.x.toFixed(3);
        state.dirY = +_dir.y.toFixed(3);
        state.dirZ = +_dir.z.toFixed(3);
    };

    const tick = () => {
        const cam = cameraRef.value;
        if (cam) {
            initGui(cam);   // создаст папки один раз
            sync(cam);      // обновит значения
        }
        animationId = requestAnimationFrame(tick);
    };

    onMounted(() => {
        animationId = requestAnimationFrame(tick);
    });

    onBeforeUnmount(() => {
        cancelAnimationFrame(animationId);
        gui.destroy();
    });
}
