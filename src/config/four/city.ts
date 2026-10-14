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
    public id: number;
    static counter: number = 0;

    protected constructor(arg: CityViewArg) {
        this.html = arg.html;
        this.id = CityView.counter;

        CityView.counter++;
    }

    public apply() {
    };
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
    backgroundStart: '#1f0e2a',
    backgroundEnd: '#2f1114',
};

export const links = {
    resume: getStaticLink('/documents/Resume_Vladimirov.pdf'),
};

export const cameraMode = {
    static: {
        welcome: {
            pos: new THREE.Vector3(10, 10, 10),
            target: new THREE.Vector3(6, 3, 2),
            html: {
                button: 'HELLO WORLD!',
                title: '',
                // text: `Привет! Меня зовут Максим.<br/>
                // Frontend + Backend разработчик.<br/>
                // <a href="${links.resume}" target="_blank">Скачать резюме.PDF</a>`
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
        },
        tech: {
            pos: new THREE.Vector3(-0.367, 3.378, -4.388),
            target: new THREE.Vector3(0.335, 2.949, -4.648),
            html: {
                button: 'TECHNOLOGY',
                title: '',
                text: `Мой основной стек:<br/>
                <br/>
                Frontend:<br/>
                <br/>
                * JavaScript/TypeScript<br/>
                * Vue/Nuxt (options/composition)<br/>
                <br/>
                Backend:<br/>
                <br/>
                * php 8+<br/>
                * Laravel 12/13`,
            },
        },
        works: {
            pos: new THREE.Vector3(-1.617, 2.041, 0.47),
            target: new THREE.Vector3(-1.221, 1.503, -0.569),
            html: {
                button: 'РАБОТЫ',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
        },
        repo: {
            pos: new THREE.Vector3(-2.605, 2.849, -13.412),
            target: new THREE.Vector3(-2.408, 2.855, -13.198),
            html: {
                button: 'GITHUB',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
        },
        contacts: {
            pos: new THREE.Vector3(4.099, 3.749, 0.322),
            target: new THREE.Vector3(1.814, 4.861, -2.008),
            html: {
                button: 'КОНТАКТЫ',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
        },
    },
    forward: {
        about: {
            html: {
                button: 'О САЙТЕ',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
            modelName: 'Empty',
            obj: undefined,
            followDistance: 0.3,
            followHeight: 1,
            followLookAtHeight: 0.1,
            dirSmoothing: 0.1,
        }
    }
};

