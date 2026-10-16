import * as THREE from "three";

export class CustomAnimator {
    private static emissiveAnimated: THREE.MeshStandardMaterial[] = [];

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
}

export function collectMixerAnimations(animations: THREE.AnimationClip[], item: THREE.Object3D
): THREE.AnimationMixer | null {
    if (!(animations && animations.length)) {
        return null;
    }

    const mixer = new THREE.AnimationMixer(item);

    CustomAnimator.collectAnimatedMaterials(item);

    for (const clip of animations) {
        const action = mixer.clipAction(clip);

        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
    }

    return mixer;
}
