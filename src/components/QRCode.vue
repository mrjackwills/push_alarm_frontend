<template>
	<v-row align='center' justify='center' no-gutters class='ma-0 pa-0'>

		<v-col class='ma-0 pa-0'>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='auto' v-if='timeout === 0'>
					<QrCode :value='qrCode' :size='size' level='H' />
				</v-col>
				<v-col cols='auto text-black ltext  ma-0 pa-0' v-else>
					{{ zeroPadTimeout }}
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useDocumentVisibility } from '@vueuse/core';
import { zeroPad } from '@/vanillaTS/zeropad';
import QrCode from 'qrcode.vue';

const visibility = useDocumentVisibility();

const { mobile } = useDisplay();

const interval = ref(0);
const timeout = ref(-1);

const reset_timer = (): void => {
	timeout.value = props.timeout_limit;
	clearInterval(interval.value);
	interval.value = window.setInterval(() => {
		if (timeout.value <= 0) {
			clearInterval(interval.value);

		} else {
			timeout.value -= 1;
		}
	}, 1000);
};

const qrCode = computed((): string => {
	return `https://alarm.mrjackwills.com`;
});

const size = computed((): number => {
	return Math.floor(window.innerWidth / 3);
});

const zeroPadTimeout = computed(() : string => {
	return zeroPad(timeout.value);
});

watch(mobile, (i) => {
	if (i) {
		reset_timer();
	}
});

watch(visibility, (current, previous) => {
	if (current === 'visible' && previous === 'hidden') {
		reset_timer();
	}
});

onMounted(() => {
	reset_timer();
});

const props = defineProps<{
	timeout_limit: number
}>();

</script>

<style>
.ltext{
	font-size: 12rem;
}
</style>