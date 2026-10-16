import * as THREE from "three";

export interface LoadArg {
    target: THREE.Object3D;
    path: string;
    volume?: number;
    refDistance?: number;
    rolloffFactor?: number;
    loopStart?: number;
    loopEnd?: number;
}

export interface LoadResult {
    sound: THREE.PositionalAudio;
}

export class SoundLoader {
    public camera: THREE.Camera;
    public listener: THREE.AudioListener;
    public volume = 0.8;
    public refDistance = 10;
    public rolloffFactor = 15;

    constructor({ camera }: { camera: THREE.Camera }) {
        this.camera = camera;
        this.listener = new THREE.AudioListener();

        this.camera.add(this.listener);
    }


    public async load(opt: LoadArg): Promise<LoadResult> {
        const loader = new THREE.AudioLoader();
        const buffer = await loader.loadAsync(opt.path);

        let _target = opt.target;
        let targetFoundByTraverse = false;

        if (opt.target.userData.modelName) {
            opt.target.traverse((obj) => {
                if (targetFoundByTraverse) {
                    return;
                }

                if (obj.name === opt.target.userData.modelName) {
                    _target = obj;
                    console.log('OPTPOPOPO', obj);
                    targetFoundByTraverse = true;
                }
            });
        }

        const sound = new THREE.PositionalAudio(this.listener);
        sound.setBuffer(buffer);


        sound.setLoop(true);
        sound.setVolume(opt.volume ?? this.volume);
        sound.setRefDistance(opt.refDistance ?? this.refDistance);
        sound.setRolloffFactor(opt.rolloffFactor ?? this.rolloffFactor);
        sound.setDistanceModel('exponential');

        _target.add(sound);


        if (opt.loopStart) {
            sound.setLoopStart(buffer.duration * opt.loopStart);
        }
        if (opt.loopEnd) {
            sound.setLoopEnd(buffer.duration * opt.loopEnd);
        }

        return { sound };
    }

    public loadMany(arr: LoadArg[]) {
        return Promise.all(arr.map((arg) => this.load(arg)));
    }
}
