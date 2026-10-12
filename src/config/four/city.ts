import * as THREE from 'three';
import { getStaticLink } from "@/utils";

export type Html = {
    title: string;
}

type CityViewArg = {
    html: Html;
}

export interface CityViewStaticArg extends CityViewArg {
    pos: THREE.Vector3;
    target: THREE.Vector3;
}

export interface CityViewForwardArg extends CityViewArg {
    obj: THREE.Object3D;
    followDistance: number;
    followHeight: number;
    followLookAtHeight: number;
    dirSmoothing?: number;
}


/* Class */

abstract class CityView {
    public html: Html;

    protected constructor(arg: CityViewArg) {
        this.html = arg.html;
    }
}


export class CityViewStatic extends CityView {
    public pos: THREE.Vector3;
    public target: THREE.Vector3;

    constructor(arg: CityViewStaticArg) {
        super(arg);
        this.pos = arg.pos;
        this.target = arg.target;
    }
}

export class CityViewForward extends CityView {
    public obj: THREE.Object3D;
    public followDistance: number;
    public followHeight: number;
    public followLookAtHeight: number;
    public dirSmoothing: number = 0.1;

    constructor(arg: CityViewForwardArg) {
        super(arg);
        this.obj = arg.obj;
        this.followDistance = arg.followDistance;
        this.followHeight = arg.followHeight;
        this.followLookAtHeight = arg.followLookAtHeight;

        if (arg.dirSmoothing) {
            this.dirSmoothing = arg.dirSmoothing;
        }
    }
}

export type CityViewStaticOrForward = CityViewStatic | CityViewForward;
/* --------------------- configs --------------------- */
export const files = {
    city: getStaticLink('/3d/models/city.glb'),
};

export const colors = {
    background: '#700e24',
};

export const cameraMode = {
    static: {
        welcome: {
            pos: new THREE.Vector3(10, 10, 10),
            target: new THREE.Vector3(6, 3, 2),
            html: { title: '' },
        },
        one: {
            pos: new THREE.Vector3(-0.367, 3.378, -4.388),
            target: new THREE.Vector3(0.335, 2.949, -4.648),
            html: { title: '' },
        },
        two: {
            pos: new THREE.Vector3(-10, 8, -5),
            target: new THREE.Vector3(6, 3, 2),
            html: { title: '' },
        }
    },
    forward: {
        one: {
            html: { title: '' },
            modelName: 'Empty',
            obj: undefined,
            followDistance: 0.3,
            followHeight: 1,
            followLookAtHeight: 0.1,
            dirSmoothing: 0.1,
        }
    }
};

