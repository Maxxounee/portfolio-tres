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
        this.graphemes = Array.from(opt.str);
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
                onUpdate(this.graphemes.slice(0, idx).join(''));
                // this.str = this.graphemes.slice(0, idx).join('');
            },
            onComplete,
        });
    }

    stop(): void {
        this.tl?.kill();
        this.tl = null;
    }
}
