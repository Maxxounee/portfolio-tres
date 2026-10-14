import type { CityBuildResult } from "@/utils/four/types.ts";
import * as THREE from "three";

function collectEmissiveBlinking() {

}

const config = {
    emissingNames: { env_00: true }
};

export function collectAnimations(arr: THREE.InstancedMesh[]) {
    const emissiveBlinking: THREE.MeshStandardMaterial[] = [];

    const emissiveBlinkingPlay = (ctx: { elapsed: number }) => {
        const blink = Math.sin(ctx.elapsed * 3) > 0 ? 3 : 0;

        for (const mat of emissiveBlinking) {
            mat.emissiveIntensity = blink;
        }
    };

    const collect = (obj: THREE.Object3D) => {
        obj.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;

            /* TODO: переделать весь файл */
            if (
                obj.custom_model_name in config.emissingNames &&
                child.material instanceof THREE.MeshStandardMaterial &&
                child.material.emissive.getHex()
            ) {
                emissiveBlinking.push(child.material);
                return;
            }
        });
    };

    for (const inst of arr) {
        collect(inst);
    }

    return {
        emissiveBlinkingPlay
    };
}
