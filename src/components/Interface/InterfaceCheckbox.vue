<template>
    <label class="InterfaceCheckbox">
        <p class="InterfaceCheckbox__text">{{ text }}</p>
        <div class="InterfaceCheckbox__box">
            <label class="InterfaceCheckbox__switch">
                <input
                    type="checkbox"
                    :checked="props.active ?? false"
                    :disabled="props.active === null"
                    @change="onChange"
                />
                <span class="InterfaceCheckbox__slider"></span>
            </label>
        </div>
    </label>
</template>
<script setup lang="ts">
const props = defineProps<{
    text?: string
    active?: boolean | null
}>();

const emit = defineEmits<{
    (event: 'change', value: boolean): void
}>();

function onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    emit('change', target.checked);
}
</script>
<style lang="scss">
.InterfaceCheckbox {
    pointer-events: auto;
    @include flex(center);
    @include fontKulag(2.6rem);
    cursor: pointer;
    gap: 1rem;
    position: relative;

    &__box {
        --switch_width: 6rem;
        --switch_height: 3rem;
        --thumb_color: #e8e8e8;
        --track_color: #e8e8e8;
        //--track_active_color: #888;
        --track_active_color: var(--ORANGE);
        --outline_color: #000;
        width: var(--switch_width);
        height: var(--switch_height);
        position: relative;
    }

    input[type="checkbox"] {
        //visibility: hidden;
        //display: none;
        opacity: 0;

        &:focus-visible {
            & + .InterfaceCheckbox__slider {
                box-shadow: 0 0 0 2px var(--track_active_color);
            }
        }

        &:hover {
            & + .InterfaceCheckbox__slider:before {
                transform: translateY(-0.8rem);
                box-shadow: 0 0.8rem 0 var(--outline_color);
            }

            &:checked + .InterfaceCheckbox__slider:before {
                transform: translateX(calc(var(--switch_width) - var(--switch_height))) translateY(-0.3em);
                box-shadow: 0 0.3em 0 var(--outline_color);
            }
        }

        &:checked {
            & + .InterfaceCheckbox__slider {
                background-color: var(--track_active_color);

                &:before {
                    transform: translateX(calc(var(--switch_width) - var(--switch_height))) translateY(-0.2em);
                }
            }
        }
    }

    .InterfaceCheckbox__slider {
        box-sizing: border-box;
        border: 2px solid var(--outline_color);
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--track_color);
        transition: .15s;
        border-radius: var(--switch_height);

        &:before {
            box-sizing: border-box;
            position: absolute;
            content: "";
            height: var(--switch_height);
            width: var(--switch_height);
            border: 2px solid var(--outline_color);
            border-radius: 100%;
            left: -2px;
            bottom: -2px;
            background-color: var(--thumb_color);
            transform: translateY(-0.2em);
            box-shadow: 0 0.2em 0 var(--outline_color);
            transition: .15s;
        }
    }

}
</style>
