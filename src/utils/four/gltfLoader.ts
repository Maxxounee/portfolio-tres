import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFAnimationPointerExtension } from "@needle-tools/three-animation-pointer";

const loader = new GLTFLoader();
loader.register((parser) => new GLTFAnimationPointerExtension(parser));
const cache = new Map<string, Promise<GLTF>>();

function loadGLBUncached(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf),
            undefined,
            (err) => reject(err),
        );
    });
}

export function loadGLB(url: string): Promise<GLTF> {
    if (!cache.has(url)) {
        cache.set(url, loadGLBUncached(url));
    }

    return cache.get(url)!;
}

export function loadCityModel(url: string,): Promise<GLTF> {
    return loadGLB(url);
}
