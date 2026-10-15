import * as THREE from "three";
import { getStaticLink } from "@/utils";

const listener = new THREE.AudioListener();
const loader = new THREE.AudioLoader();
let audio: THREE.PositionalAudio;

export function loadEnvAudio({ target }: { target: THREE.Object3D }): Promise<{
    listener: THREE.AudioListener,
    audio: THREE.PositionalAudio
}> {
    return new Promise((resolve) => {
        loader.load(
            getStaticLink('/audio/env/helicopter.mp3'),
            (buffer) => {
                const sound = new THREE.PositionalAudio(listener);

                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0.5);
                sound.setRefDistance(15);
                sound.setRolloffFactor(1);
                sound.setDistanceModel('inverse');

                target.add(sound);
                audio = sound;

                resolve({ listener, audio });
            }
        );
    });

}
