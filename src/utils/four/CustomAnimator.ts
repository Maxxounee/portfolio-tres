import * as THREE from "three";

interface ICustomAnimator {
    emissiveAnimated: THREE.MeshStandardMaterial[];
    collectAnimatedMaterials: (
        obj: THREE.Object3D,
        materialNameStartsWith: string
    ) => void;
    isReady: boolean;
    add: (mat: THREE.MeshStandardMaterial) => void;
    play: (ctx: { elapsed: number }) => void;
}

export class CustomAnimator {
    static emissiveAnimated: THREE.MeshStandardMaterial[] = [];

    static renderer: (ctx: { elapsed: number }) => void;

    public static get isReady() {
        return !!CustomAnimator.emissiveAnimated.length;
    }

    public static collectAnimatedMaterials(
        obj: THREE.Object3D,
        materialNameStartsWith: string = 'emissive_anim'
    ) {
        obj.traverse((child: THREE.Mesh | THREE.Object3D) => {
            if (
                child instanceof THREE.Mesh
                && child.material
                && child.material.name.startsWith(materialNameStartsWith)
            ) {
                CustomAnimator.emissiveAnimated.push(child.material);
            }

        });
    }

    public static add(mat: THREE.MeshStandardMaterial) {
        CustomAnimator.emissiveAnimated.push(mat);
    }

    public static play(ctx: { elapsed: number }) {
        const blink = Math.sin(ctx.elapsed * 3) > 0 ? 3 : 0;

        for (const mat of CustomAnimator.emissiveAnimated) {
            mat.emissiveIntensity = blink;
        }
    }

    // public static registerRenderer(renderer: (ctx: { elapsed: number })) {
    //     CustomAnimator.renderer = renderer
    // }
}

const _check: ICustomAnimator = CustomAnimator;
