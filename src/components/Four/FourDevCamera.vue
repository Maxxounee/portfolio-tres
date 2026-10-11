<template>
	<TresPerspectiveCamera
			ref="cameraRef"
			:fov="75"
			:near="0.1"
			:far="1000"
	/>
	<OrbitControls/>
</template>
<script setup lang="ts">
import { OrbitControls } from "@tresjs/cientos";
import { useMainStore } from "@/store/main";
import { useTresGui } from "@/utils/tres/useTresGui";
import type { Ref } from 'vue';
import { ref } from "vue";
import type { TresInstance } from "@tresjs/core";

const cameraRef: Ref<TresInstance | null> = ref(null);

useTresGui({ cameraRef });
</script>
