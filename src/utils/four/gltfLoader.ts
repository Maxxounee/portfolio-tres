import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

/** Загружает .glb и возвращает полный gltf (с анимациями). */
export function loadGLB(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf),
            undefined,
            (err) => reject(err),
        );
    });
}

export function loadCityModel(url: string,): Promise<GLTF> {
    return loadGLB(url);
}
