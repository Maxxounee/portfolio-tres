<template>
    <button
        class="InterfaceButtonsItem"
        :class="{ active: props.active }"
    >
        <span v-html="props.text"></span>
    </button>
</template>
<script setup lang="ts">
const props = defineProps<{
    text?: string
    active?: boolean
}>();
</script>
<style scoped lang="scss">
.InterfaceButtonsItem {
    @include flex(center);
    @include fontKulag(2.6rem);
    --lr-padding: 2rem;
    --width: 21rem;
    --inner-width: calc(var(--width) - var(--lr-padding) * 2);

    pointer-events: auto;
    background-color: var(--BLACK);
    color: var(--WHITE);
    border: 3px solid var(--WHITE);
    outline: 3px solid Var(--BLACK);
    box-shadow: 6px 6px 0 var(--DIALOGUE);
    transition: all 0.1s ease-out;
    padding: 0 var(--lr-padding) 0.6rem;
    overflow: hidden;
    width: var(--width);
    height: 5rem;
    white-space: nowrap;

    &:hover {
        transform: translate(-4px, -4px);
        box-shadow: 10px 10px 0 #000;
        background-color: #000;
    }

    &:active {
        transform: translate(4px, 4px);
        box-shadow: 0px 0px 0 #00a4ef;
        border-color: var(--BLACK);
    }

    span {
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: ease-in-out;
    }

    &.active {
        opacity: 0.3;
        pointer-events: none;
        cursor: default;
        transform: translate(0);

        span {
            transform: translateX(calc(var(--inner-width) - 100%));
        }
    }
}
</style>
