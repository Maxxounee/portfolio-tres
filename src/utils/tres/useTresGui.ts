import { onMounted, onBeforeUnmount, type Ref } from 'vue';
import GUI from 'lil-gui';
import * as THREE from 'three';
import type { TresInstance } from '@tresjs/core';

export interface UseTresGuiOptions {
    /** Ref на камеру. */
    cameraRef: Ref<TresInstance | null>;
    /**
     * Ref на target (для OrbitControls или статичного «lookAt»).
     * Если не передан — target будет редактироваться вручную и
     * использоваться только для вычисления direction.
     */
    targetRef?: Ref<THREE.Vector3 | null>;
    /** Заголовок GUI. */
    title?: string;
}

export function useTresGui({
                               cameraRef,
                               targetRef,
                               title = 'Camera Debug',
                           }: UseTresGuiOptions): void {
    const gui = new GUI({ title });

    let initialized = false;
    let animationId = 0;

    /* ============================================================
     *  Локальный state для lil-gui (plain object, не reactive)
     * ==========================================================*/

    const state = {
        // Позиция (редактируемая)
        posX: 0,
        posY: 0,
        posZ: 0,

        // Target / lookAt (редактируемый)
        targetX: 0,
        targetY: 0,
        targetZ: 0,

        // Rotation в градусах (read-only)
        rotX: 0,
        rotY: 0,
        rotZ: 0,

        // Direction (read-only)
        dirX: 0,
        dirY: 0,
        dirZ: 0,

        // Действия
        saveView: () => saveView(),
        logView: () => logView(),
        applyTarget: () => applyTarget(),
    };

    const _dir = new THREE.Vector3();
    const _target = new THREE.Vector3();

    /* ============================================================
     *  Инициализация папок (один раз)
     * ==========================================================*/

    const initGui = (cam: TresInstance): void => {
        if (initialized) return;
        initialized = true;

        const folder = gui.addFolder('Camera');

        // --- Position (управляемое) ---
        folder
            .add(state, 'posX', -100, 100, 0.01)
            .name('Pos X')
            .listen()
            .onChange((v: number) => {
                cam.position.x = v;
            });

        folder
            .add(state, 'posY', -100, 100, 0.01)
            .name('Pos Y')
            .listen()
            .onChange((v: number) => {
                cam.position.y = v;
            });

        folder
            .add(state, 'posZ', -100, 100, 0.01)
            .name('Pos Z')
            .listen()
            .onChange((v: number) => {
                cam.position.z = v;
            });

        // --- Target (управляемое, если targetRef есть) ---
        const targetFolder = folder.addFolder('Target (lookAt)');

        targetFolder
            .add(state, 'targetX', -100, 100, 0.01)
            .name('X')
            .listen()
            .onChange((v: number) => {
                setTarget(v, state.targetY, state.targetZ);
            });

        targetFolder
            .add(state, 'targetY', -100, 100, 0.01)
            .name('Y')
            .listen()
            .onChange((v: number) => {
                setTarget(state.targetX, v, state.targetZ);
            });

        targetFolder
            .add(state, 'targetZ', -100, 100, 0.01)
            .name('Z')
            .listen()
            .onChange((v: number) => {
                setTarget(state.targetX, state.targetY, v);
            });

        targetFolder.add(state, 'applyTarget').name('Apply (lookAt)');

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

        // --- Действия ---
        const actions = folder.addFolder('Actions');
        actions.add(state, 'saveView').name('Save view (copy)');
        actions.add(state, 'logView').name('Log view (console)');

        // Закрыть всё, кроме Camera, чтобы не забивать экран
        rotFolder.close();
        dirFolder.close();
        actions.close();
    };

    /* ============================================================
     *  Target helpers
     * ==========================================================*/

    const setTarget = (x: number, y: number, z: number): void => {
        const t = targetRef?.value;
        if (t) {
            t.set(x, y, z);
        } else {
            _target.set(x, y, z);
        }
    };

    const getTarget = (): THREE.Vector3 => {
        return targetRef?.value ?? _target;
    };

    const applyTarget = (): void => {
        const cam = cameraRef.value;
        if (!cam) return;
        cam.lookAt(getTarget());
    };

    /* ============================================================
     *  Действия
     * ==========================================================*/

    const collectView = (): {
        pos: [number, number, number]
        target: [number, number, number]
    } => {
        const cam = cameraRef.value;
        const t = getTarget();

        return {
            pos: [
                +(cam?.position.x ?? 0).toFixed(3),
                +(cam?.position.y ?? 0).toFixed(3),
                +(cam?.position.z ?? 0).toFixed(3),
            ],
            target: [
                +t.x.toFixed(3),
                +t.y.toFixed(3),
                +t.z.toFixed(3),
            ],
        };
    };

    const saveView = (): void => {
        const cam = cameraRef.value;
        if (!cam) return;

        const t = getTarget();

        const px = +cam.position.x.toFixed(3);
        const py = +cam.position.y.toFixed(3);
        const pz = +cam.position.z.toFixed(3);

        const tx = +t.x.toFixed(3);
        const ty = +t.y.toFixed(3);
        const tz = +t.z.toFixed(3);

        const snippet =
            `pos: new THREE.Vector3(${px}, ${py}, ${pz}),\n` +
            `target: new THREE.Vector3(${tx}, ${ty}, ${tz}),`;

        console.log('[Camera View]\n' + snippet);

        navigator.clipboard
            .writeText(snippet)
            .then(() => console.log('[Camera View] Скопировано в буфер'))
            .catch((err) => console.error('[Camera View] Не удалось скопировать', err));
    };

    const logView = (): void => {
        const cam = cameraRef.value;
        if (!cam) return;

        const view = collectView();
        const dir = cam.getWorldDirection(new THREE.Vector3());

        console.log('[Camera View]', {
            pos: view.pos,
            target: view.target,
            direction: [
                +dir.x.toFixed(3),
                +dir.y.toFixed(3),
                +dir.z.toFixed(3),
            ],
        });
    };

    /* ============================================================
     *  Sync — обновляет state из камеры и target
     * ==========================================================*/

    const sync = (cam: TresInstance): void => {
        // Position
        state.posX = +cam.position.x.toFixed(3);
        state.posY = +cam.position.y.toFixed(3);
        state.posZ = +cam.position.z.toFixed(3);

        // Target
        const t = getTarget();
        state.targetX = +t.x.toFixed(3);
        state.targetY = +t.y.toFixed(3);
        state.targetZ = +t.z.toFixed(3);

        // Rotation в градусах
        state.rotX = +THREE.MathUtils.radToDeg(cam.rotation.x).toFixed(1);
        state.rotY = +THREE.MathUtils.radToDeg(cam.rotation.y).toFixed(1);
        state.rotZ = +THREE.MathUtils.radToDeg(cam.rotation.z).toFixed(1);

        // Direction
        cam.getWorldDirection(_dir);
        state.dirX = +_dir.x.toFixed(3);
        state.dirY = +_dir.y.toFixed(3);
        state.dirZ = +_dir.z.toFixed(3);
    };

    /* ============================================================
     *  Цикл
     * ==========================================================*/

    const tick = (): void => {
        const cam = cameraRef.value;
        if (cam) {
            initGui(cam);
            sync(cam);
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
