<template>
	<v-row align='center' justify='center' no-gutters class='ma-0 pa-0'>

		<v-col class='ma-0 pa-0'>
			<v-row align='center' justify='center' class='ma-0 pa-0'>
				<v-col cols='auto' v-if='timeout === 0'>
					<v-row justify='center' class='ma-0 pa-0'>
						<v-col cols='auto' class='ma-0 pa-0'>
							<QrCode :value='qrCode' :size='size' level='H' />
						</v-col>
					</v-row>
					<v-row justify='center' class='ma-0 pa-0'>
						<v-col cols='auto' class='ma-0 pa-0' v-if='wsConnected'>
							<v-btn
								@click='dismiss'
								color='secondary'
								rounded='lg'
								size='small'
								variant='elevated'
							>
								<v-icon style='vertical-align: middle;' class='mr-2' size='small' :icon='mdiPower' color='white' />
								<span class='text-white'>dismiss alarm</span>
							</v-btn>
						</v-col>
					</v-row>
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
import { mdiPower } from '@mdi/js';
import { useDocumentVisibility } from '@vueuse/core';
import { zeroPad } from '@/vanillaTS/zeropad';
import QrCode from 'qrcode.vue';

const websocketStore = websocketModule();

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
	return Math.floor(window.innerWidth / 4);
});

const zeroPadTimeout = computed((): string => {
	return zeroPad(timeout.value);
});

const wsConnected = computed(() => {
	return websocketStore.connected; 
});

const dismiss = (): void => {
	if (wsConnected.value) {
		websocketStore.send({ name: 'alarm_dismiss' });
	}
};

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

const props = defineProps<{ timeout_limit: number }>();

</script>

<style>
.ltext{
	font-size: 12rem;
}
</style>