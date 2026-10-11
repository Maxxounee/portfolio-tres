<template>
    <template v-for="(item, i) in buildings" :key="i">
        <Instances
            v-if="item.mesh"
            :geometry="item.mesh.geometry"
            :material="item.mesh.material"
        >
            <Instance
                v-for="(inst, k) in positions[i]"
                :key="`b-${i}-${k}`"
                :position="inst.pos"
                :scale="inst.scale"
            />
        </Instances>
    </template>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import * as THREE from 'three';
import { Instance, Instances } from '@tresjs/cientos';

type Vec3 = [number, number, number]

interface InstanceData {
    pos: Vec3;
    scale: Vec3;
}

/* ============================================================
 *  Параметры
 * ==========================================================*/

const SAFE_ZONE = { width: 20, depth: 50 };
const CITY_BOUNDS = { width: 150, depth: 150 };
const BUILDING_FOOTPRINT = 4;
const JITTER = 3;
const SPACING = 2;

/** Базовые высоты — размеры геометрий. */
const HEIGHTS = [5, 7, 8] as const;

/** Максимальная высота, до которой масштабируем на краю города. */
const MAX_HEIGHT_FACTOR = 3;

/* ============================================================
 *  Базовые меши
 * ==========================================================*/

function createBuildingMesh(name: string, height: number, color: number): THREE.Mesh {
    const geo = new THREE.BoxGeometry(
        BUILDING_FOOTPRINT,
        height,
        BUILDING_FOOTPRINT,
    );
    // Origin внизу куба
    geo.translate(0, height / 2, 0);

    const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = name;
    return mesh;
}

const buildings = computed(() =>
    HEIGHTS.map((height, i) => ({
        height,
        mesh: createBuildingMesh(`building_${i}`, height, 0x374151),
    })),
);

/* ============================================================
 *  Генерация позиций
 * ==========================================================*/

interface GridOptions {
    bounds: { width: number; depth: number };
    safe: { width: number; depth: number };
    step: number;
    jitter: number;
}

function generatePositions(options: GridOptions): Vec3[] {
    const { bounds, safe, step, jitter } = options;
    const result: Vec3[] = [];

    const halfW = bounds.width / 2;
    const halfD = bounds.depth / 2;
    const safeHalfW = safe.width / 2;
    const safeHalfD = safe.depth / 2;

    for (let x = -halfW; x <= halfW; x += step) {
        for (let z = -halfD; z <= halfD; z += step) {
            const inSafeX = Math.abs(x) < safeHalfW;
            const inSafeZ = Math.abs(z) < safeHalfD;

            if (inSafeX && inSafeZ) continue;

            const jx = (Math.random() - 0.5) * jitter;
            const jz = (Math.random() - 0.5) * jitter;

            result.push([x + jx, 0, z + jz]);
        }
    }

    return result;
}

const allPositions = generatePositions({
    bounds: CITY_BOUNDS,
    safe: SAFE_ZONE,
    step: BUILDING_FOOTPRINT + SPACING,
    jitter: JITTER,
});

/* ============================================================
 *  Высота в зависимости от расстояния до центра
 * ==========================================================*/

/**
 * Возвращает коэффициент высоты в зависимости от расстояния до центра.
 * 0 — в центре, 1 — на самой границе города.
 *
 * centerBias = 0.0 → здания в центре низкие, на краю — высокие
 * centerBias = 1.0 → здания в центре высокие, на краю — низкие
 */
function heightFactor(pos: Vec3, centerBias: number = 0): number {
    const dist = Math.hypot(pos[0], pos[2]);
    const maxDist = Math.hypot(
        CITY_BOUNDS.width / 2,
        CITY_BOUNDS.depth / 2,
    );
    const t = Math.min(dist / maxDist, 1);

    // centerBias = 0 → t (низко в центре, высоко на краю)
    // centerBias = 1 → 1 - t (высоко в центре, низко на краю)
    return t * (1 - centerBias) + (1 - t) * centerBias;
}

/**
 * Считает масштаб по Y для экземпляра.
 * Никогда не меньше 1.0 — базовые меши уже минимальны.
 */
function scaleForInstance(
    pos: Vec3,
    baseHeight: number,
    centerBias: number,
): Vec3 {
    const factor = heightFactor(pos, centerBias);
    const targetHeight = baseHeight + (MAX_HEIGHT_FACTOR - 1) * baseHeight * factor;
    const scaleY = targetHeight / baseHeight;

    // Округление до 2 знаков, чтобы матрицы не раздувались
    const s = Math.round(scaleY * 100) / 100;
    return [1, s, 1];
}

/* ============================================================
 *  Распределение по типам и подготовка данных
 * ==========================================================*/

/** Куда базируем: 0 — низко в центре, 1 — высоко в центре. */
const CENTER_BIAS = 0;

function assignType(): 0 | 1 | 2 {
    const r = Math.random();
    if (r < 0.6) return 0;
    if (r < 0.9) return 1;
    return 2;
}

const positions: InstanceData[][] = [[], [], []];

allPositions.forEach((pos) => {
    const type = assignType();
    const baseHeight = HEIGHTS[type];
    const scale = scaleForInstance(pos, baseHeight, CENTER_BIAS);

    positions[type].push({ pos, scale });
});
</script>
