<template>
	<v-row align='center' justify='center'>
		<v-col cols='auto' class='text-caption'>

			<v-row justify='center' class='ma-0 pa-0' v-if='cache'>
				<v-col cols='auto' class='text-error font-weight-black'>
					OFFLINE CACHED VALUES
				</v-col>
			</v-row>

			<v-row justify='space-between' class='ma-0 pa-0' v-if='current_time'>
				<v-col cols='6' class='ma-0 pa-0'>
					alarm: <span class='font-weight-bold' v-if='alarm'>{{ hour }}:{{ minute }}</span>
				</v-col>
				<v-col cols='6' class='ma-0 pa-0'>
					time zone: <span class='font-weight-bold'>{{ time_zone }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					backend version: <span class='font-weight-bold'>{{ backend_version }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					frontend version: <span class='font-weight-bold'>{{ env.app_version }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					uptime app: <span class='font-weight-bold'>{{ uptime_app }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					uptime ws: <span class='font-weight-bold'>{{ uptime_ws }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					uptime: <span class='font-weight-bold'>{{ uptime }}</span>
				</v-col>

				<v-col cols='6' class='ma-0 pa-0'>
					current time: <span class='font-weight-bold'>{{ zpad(current_time.hour) }}:{{ zpad(current_time.minute)
					}}:{{ zpad(current_time.second) }}</span>
				</v-col>
			</v-row>
			<br>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { env } from '@/vanillaTS/env';
import { secondsToText } from '@/vanillaTS/secondsToText';
import { Time } from '@/types';
import { zeroPad } from '@/vanillaTS/zeropad';

const statusStore = statusModule();

/// Zero pad a number
const zpad = (x: number): string => {
	return zeroPad(x);
};

const alarm = computed(() => {
	return statusStore.alarm;
});

const hour = computed(() => {
	if (alarm.value !== undefined)
		return zeroPad(alarm.value.hour);
});

const minute = computed(() => {
	if (alarm.value !== undefined)
		return zeroPad(alarm.value.minute);
});

const cache = computed(() => {
	return statusStore.cache;
});

const time_zone = computed(() => {
	return statusStore.time_zone;
});

const uptime_app = computed(() => {
	return secondsToText(statusStore.uptime_app);
});

const uptime_ws = computed(() => {
	return secondsToText(statusStore.uptime_ws);
});

const uptime = computed(() => {
	return secondsToText(statusStore.uptime);
});

const backend_version = computed(() => {
	return statusStore.version;
});

defineProps<{
	current_time?: Time
}>();
</script>