// utils/four/audio.ts
import * as THREE from 'three';
import { getStaticLink } from '@/utils';

export interface EnvAudioResult {
    // listener: THREE.AudioListener;
    sound: THREE.PositionalAudio;
}

export interface LoadEnvAudioOptions {
    target: THREE.Object3D;
    listener: THREE.AudioListener;
    path: string;
    // /** Громкость. */
    // volume?: number;
    // /** Расстояние, на котором громкость полная. */
    // refDistance?: number;
    // /** Скорость затухания. */
    // rolloffFactor?: number;
}

const volume = 0.4;
const refDistance = 15;
const rolloffFactor = 1;

export async function loadEnvAudio({
    target,
    path,
    listener,
}: LoadEnvAudioOptions): Promise<EnvAudioResult> {
    const loader = new THREE.AudioLoader();

    return new Promise(async (resolve) => {
        const buffer = await loader.loadAsync(path);

        const sound = new THREE.PositionalAudio(listener);
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(volume);
        sound.setRefDistance(refDistance);
        sound.setRolloffFactor(rolloffFactor);
        sound.setDistanceModel('inverse');

        target.add(sound);

        resolve({ sound });
    });
}
