<template>
    <button
        class="InterfaceButtonsItem"
        :class="{ active: props.active }"
    >
        <span v-html="props.text"></span>
    </button>
</template>
<script setup lang="ts">
const props = defineProps({
    text: '',
    active: true
});
</script>
<style scoped lang="scss">
@keyframes slide {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

.InterfaceButtonsItem {
    @include flex(center);
    @include size(16rem, 6rem);
    @include fontIgra(2rem);

    pointer-events: auto;
    background-color: var(--BLACK);
    color: var(--WHITE);
    border: 3px solid var(--WHITE);
    outline: 3px solid Var(--BLACK);
    box-shadow: 6px 6px 0 var(--DIALOGUE);
    transition: all 0.1s ease-out;
    padding: 0 2rem;
    overflow: hidden;
    width: 25rem;
    white-space: nowrap;


    &::before {
        //content: "";
        //position: absolute;
        //top: 0;
        //left: -100%;
        //width: 100%;
        //height: 100%;
        //background: linear-gradient(
        //        90deg,
        //        transparent,
        //        rgba(255, 255, 255, 0.1),
        //        transparent
        //);
        //z-index: 1;
        //transition: none;
        ///* Initially hide the pseudo-element */
        //opacity: 0;
    }

    &:hover {
        transform: translate(-4px, -4px);
        box-shadow: 10px 10px 0 #000;
        background-color: #000;

        &::before {
            opacity: 1;
            animation: slide 2s infinite;
        }
    }

    &:active {
        transform: translate(4px, 4px);
        box-shadow: 0px 0px 0 #00a4ef;
        //background-color: var(--WHITE);
        //color: var(--BLACK);
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
        //box-shadow: 6px 6px 0 var(--RED);

        span {
            transform: translateX(calc(21rem - 100%));
        }

        //background: red;
    }
}
</style>
