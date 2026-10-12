<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125"/>
        <div class="wrapper">
        </div>
    </header>
    <RouterView/>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";

const w = ref({
    width: 1920,
    height: 1080,
    fontSize: 0,
    initial: {
        width: 1920,
        height: 1080,
    }
});

function onResize() {
    const width = innerWidth;
    const height = innerHeight;

    const ratio = (width * height) / (w.value.initial.width * w.value.initial.height);
    const fontSize = Math.round(10 * Math.sqrt(ratio));

    w.value.width = width;
    w.value.height = height;
    w.value.fontSize = fontSize;
}

watch(() => w.value.fontSize, (value) => {
    console.log('watch');
    document.querySelector('html').style.fontSize = w.value.fontSize + 'px';
});

onMounted(() => {
    window.addEventListener('resize', onResize);
    nextTick(() => onResize());
    // this.onResize();
});
</script>
<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
