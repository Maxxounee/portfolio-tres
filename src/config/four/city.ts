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
    sideOffset?: number;
    followAngle?: number;
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
    public sideOffset: number = -0.8;
    public followAngle: number = 0;

    constructor(arg: CityViewForwardArg) {
        super(arg);
        this.obj = arg.obj;
        this.followDistance = arg.followDistance;
        this.followHeight = arg.followHeight;
        this.followLookAtHeight = arg.followLookAtHeight;


        if (arg.dirSmoothing) {
            this.dirSmoothing = arg.dirSmoothing;
        }
        if (arg.sideOffset) {
            this.sideOffset = arg.sideOffset;
        }

        if (arg.followAngle) {
            this.followAngle = arg.followAngle;
        }
    }
}

export type CityViewStaticOrForward = CityViewStatic | CityViewForward;
/* --------------------- configs --------------------- */

export const files = {
    city: getStaticLink('/3d/models/city.glb'),
};


export const colors = {
    backgroundStart: '#131313',
    backgroundEnd: '#2f1114',
    fog: '#212121',
};

export const links = {
    resume: getStaticLink('/documents/Resume_Vladimirov.pdf'),
};

export const cameraMode = {
    static: {
        welcome: {
            /** fov 70 */
            // pos: new THREE.Vector3(-10.643, 6.291, 11.951),
            // target: new THREE.Vector3(-0.09, -1.633, 0.012),

            /** fov 30*/
            pos: new THREE.Vector3(-30.529, 17.913, 31.163),
            target: new THREE.Vector3(0, 0, 0),
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
            /* fov 70 */
            // pos: new THREE.Vector3(-4.206, 2.077, 5.171),
            // target: new THREE.Vector3(-2.826, 1.215, 3.9),

            /* fov 30 */
            pos: new THREE.Vector3(-1.534, 1.845, 10.323),
            target: new THREE.Vector3(-2.966, 1.046, -0.772),

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
            /** fov 70 */
            // pos: new THREE.Vector3(-1.691, 1.681, 1.753),
            // target: new THREE.Vector3(1.863, 0.583, 0.227),

            /** fov 30 */
            pos: new THREE.Vector3(-3.213, 1.445, 6.069),
            target: new THREE.Vector3(0.29, 1.449, -0.071),
            html: {
                button: 'РАБОТЫ',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
        },
        repo: {
            /** fov 70 */
            // pos: new THREE.Vector3(-6.486, 0.907, -6.873),
            // target: new THREE.Vector3(-5.699, 0.976, -5.389),

            /** fov 30 */
            pos: new THREE.Vector3(-10.962, 0.211, -9.108),
            target: new THREE.Vector3(-5.609, 0.677, 0.737),
            html: {
                button: 'GITHUB',
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
            modelName: 'car_00',
            obj: undefined,

            dirSmoothing: 0.1,

            /* fov 70 */
            // followDistance: 0.3,
            // followHeight: 0.3,
            // followLookAtHeight: 0.1,

            /* fov 30 */
            followDistance: 1,
            followHeight: 0.4,
            followLookAtHeight: 0,
            sideOffset: 0.5,
        },
        contacts: {
            html: {
                button: 'КОНТАКТЫ',
                title: '',
                text: `Привет! Меня зовут Максим.<br/>
                Frontend + Backend разработчик.<br/>`
            },
            modelName: 'car_05',
            obj: undefined,
            dirSmoothing: 0.1,

            /** fov 70 */
            // followDistance: -0.3,
            // followHeight: 1.1,
            // followLookAtHeight: -1.5,
            // sideOffset: 1,
            // followAngle: -70,

            /** fov 30*/
            followDistance: -0.3,
            followHeight: 3,
            followLookAtHeight: 0,
            sideOffset: 1,
            followAngle: -70,
        },
    }
};

