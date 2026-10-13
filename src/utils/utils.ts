import { gsap } from "gsap";
import type { Ref } from "vue";
import { ref } from "vue";

interface ITexterArg {
    str: string;
    timeForOne?: number;
    duration?: number;
}

export class Texter {
    private tl: gsap.core.Timeline | null = null;
    private readonly graphemes: string[];
    private readonly timeForOne: number;
    private readonly duration: number;
    public str: string = '';

    constructor(opt: ITexterArg) {
        const symbol = '\uE000';
        const arr = Array.from(opt.str.replace(/<br\/>/g, symbol).replace(/\s+/g, ' '));

        this.graphemes = arr.map((l) => {
            if (l === symbol) {
                return '<br/>';
            } else {
                return l;
            }
        });

        this.timeForOne = opt.timeForOne ?? 0.02;
        this.duration = opt.duration ?? this.graphemes.length * this.timeForOne;
    }

    play(onUpdate: (res: string) => void, onComplete?: () => void): void {
        this.stop();
        const progress = { value: 0 };

        this.tl = gsap.timeline();

        this.tl.to(progress, {
            value: 1,
            duration: this.duration,
            ease: 'none',
            onUpdate: () => {
                const idx = Math.floor(this.graphemes.length * progress.value);
                const str = this.graphemes.slice(0, idx).join('');
                onUpdate(str);
            },
            onComplete,
        });
    }

    stop(): void {
        this.tl?.kill();
        this.tl = null;
    }
}

export function increment(number: number, min = 0, max = 10, cycle = true) {
    let step = number;

    if (number > max) {
        step = cycle ? min : max;
    } else if (number < min) {
        step = cycle ? max : min;
    }

    return step;
}
