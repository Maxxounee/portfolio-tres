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
    backgroundNight: '#171717',
    backgroundDay: '#56bdd0',
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
                title: 'HELLO WORLD!',
                // text: `Привет! Меня зовут Максим.<br/>
                // Frontend + Backend разработчик.<br/>
                // <a href="${links.resume}" target="_blank">Скачать резюме.PDF</a>`
                // text: `Привет! Меня зовут Максим.<br/>
                // Frontend + Backend разработчик.<br/>`
                text: `Привет! Меня зовут Максим.<br/>
                <br/>
                Fullstack-разработчик. Создаю сложные<br/>
                интерактивные сайты и веб-приложения.<br/>
                <br/>
                Vue · Nuxt · PHP · Laravel<br/>
                более 4х лет в разработке
`
            },
        },
        tech: {
            /* fov 70 */
            // pos: new THREE.Vector3(-4.206, 2.077, 5.171),
            // target: new THREE.Vector3(-2.826, 1.215, 3.9),

            /* fov 30 */
            // pos: new THREE.Vector3(-1.534, 1.845, 10.323),
            // target: new THREE.Vector3(-2.966, 1.046, -0.772),
            // pos: new THREE.Vector3(-6.119, 0.972, 7.094),
            // target: new THREE.Vector3(-3.649, 1.492, 4.746),
            // pos: new THREE.Vector3(-12.703, 0.786, 10.797),
            // target: new THREE.Vector3(-4.939, 2.137, 3.627),
            // pos: new THREE.Vector3(-5.331, 1.206, 9.621),
            // target: new THREE.Vector3(-2.017, 0.9, 0.061),
            pos: new THREE.Vector3(-5.248, 1.065, 9.454),
            target: new THREE.Vector3(-3.667, 1.164, 5.04),
            html: {
                button: 'Технологии',
                title: 'основной стек:',
                // text: `Мой основной стек:<br/>
                // <br/>
                // Frontend:<br/>
                // <br/>
                // * JavaScript/TypeScript<br/>
                // * Vue/Nuxt (options/composition)<br/>
                // <br/>
                // Backend:<br/>
                // <br/>
                // * php 8+<br/>
                // * Laravel 12/13`,
                text: `Frontend:<br/>
                TypeScript · JavaScript · Vue · Nuxt<br/>
                GSAP · Three.js · LESS<br/>
                <br/>
                Backend:<br/>
                 PHP · Laravel · PostgreSQL · MySQL`
            },
        },
        experience: {
            /** fov 70 */
            // pos: new THREE.Vector3(-1.691, 1.681, 1.753),
            // target: new THREE.Vector3(1.863, 0.583, 0.227),

            /** fov 30 */
            // pos: new THREE.Vector3(-3.213, 1.445, 6.069),
            // target: new THREE.Vector3(0.29, 1.449, -0.071),
            pos: new THREE.Vector3(19.669, 20.689, 25.481),
            target: new THREE.Vector3(4.913, -3.982, 0.004),
            html: {
                button: 'ОПЫТ',
                title: 'опыт работы',
                text: `2024 — 2026<br/>
                Ведущий веб-разработчик · Руководство web-отделом<br/>
                Сайты для крупнейших застройщиков · Работа с клиентами<br/>
                <br/>
                2023 — 2024<br/>
                Frontend-разработчик<br/>
                Code-review · Поддержка и оптимизация сайтов`
            },
        },
        works: {
            /** fov 70 */
            // pos: new THREE.Vector3(-1.691, 1.681, 1.753),
            // target: new THREE.Vector3(1.863, 0.583, 0.227),

            /** fov 30 */
            // pos: new THREE.Vector3(-3.213, 1.445, 6.069),
            // target: new THREE.Vector3(0.29, 1.449, -0.071),
            pos: new THREE.Vector3(-10.962, 0.211, -9.108),
            target: new THREE.Vector3(-5.609, 0.677, 0.737),
            // pos: new THREE.Vector3(19.669, 20.689, 25.481),
            // target: new THREE.Vector3(4.913, -3.982, 0.004),
            html: {
                button: 'ПРОЕКТЫ',
                title: 'мои значимые проекты',
                text: `
                <a href="https://art.ice-towers.ru" target="_blank">ICE-TOWERS.ru</a><br/>
                <a href="https://wowfest.ru/archive/2025/#work-58225" target="_blank">· золото премии «WOW Awards» 2025</a><br/>
                <a href="https://tagline.ru/art-3d/cases/promosayt-dlya-premialjnogo-kompleksa-ice-towers-kak-proizvedenie-sovremennogo-iskusstva/" target="_blank">· серебро премии «TAGLINE Awards» 2025</a><br/>
                <br/>
                <a href="https://kingsons.ru" target="_blank">kingsons.ru</a><br/>
                <a href="https://wowfest.ru/archive/2024/#work-46535" target="_blank">· золото премии «WOW Awards» 2024</a><br/>
                <a href="https://awards.ratingruneta.ru/winners?year=2024" target="_blank">· золото премии «Рейтинг Рунета» 2024</a>

                `
            },
        },
        // repo: {
        //     /** fov 70 */
        //     // pos: new THREE.Vector3(-6.486, 0.907, -6.873),
        //     // target: new THREE.Vector3(-5.699, 0.976, -5.389),
        //
        //     /** fov 30 */
        //     pos: new THREE.Vector3(-10.962, 0.211, -9.108),
        //     target: new THREE.Vector3(-5.609, 0.677, 0.737),
        //     html: {
        //         button: 'GITHUB',
        //         title: '',
        //         text: `Привет! Меня зовут Максим.<br/>
        //         Frontend + Backend разработчик.<br/>`
        //     },
        // },

        test: {
            /** fov 70 */
            // pos: new THREE.Vector3(-6.486, 0.907, -6.873),
            // target: new THREE.Vector3(-5.699, 0.976, -5.389),

            /** fov 30 */
            pos: new THREE.Vector3(5.366, 2.361, 13.546),
            target: new THREE.Vector3(14.888, -1.937, -3.178),
            html: {
                button: 'TEST',
                title: '',
                text: `TEST`
            },
        },

    },
    forward: {
        about: {
            html: {
                button: 'О САЙТЕ',
                title: 'SOME FACTS',
                text: `
                8 зданий · 20 объектов окружения · 5 машин · 1 персонаж<br/>
                <br/>
                < 6 МБ — весь сайт целиком, с 3D-сценой
                <br/><br/>
                • Instancing сцены • Очередь загрузок на p-limit.js<br/>
                • Процедурная генерация фоновых зданий • Positional Audio
                <br/><br/>
                Код доступен на <a href="https://github.com/Maxxounee/portfolio-tres" target="_blank">github</a>
`
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
                title: 'Свяжитесь со мной',
                text: `
                <a href="https://t.me/maxounee" target="_blank">Telegram: maxounee</a>
                <br/><br/>
                <a href="https://t.me/maxounee" target="_blank">Резюме SOON</a>
<!--                <a href="tel:+79963441180">Phone: 8 996 344 11 80</a>-->
                `
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
            followHeight: 2,
            followLookAtHeight: 1,
            sideOffset: 1,
            followAngle: -90,
        },
    }
};

