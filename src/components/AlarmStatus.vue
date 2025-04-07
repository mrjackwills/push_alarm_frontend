<template>
	<v-row align='center' justify='center'>
		<v-col cols='12' class='text-caption' v-if='current_time'>

			<v-row justify='center' class='ma-0 pa-0' v-if='cache'>
				<v-col cols='auto' class='text-error font-weight-black'>
					OFFLINE CACHED VALUES
				</v-col>
			</v-row>

			<v-row justify='space-between' class='ma-0 pa-0'>
				<v-col cols='auto' class='ma-0 pa-0'>
					alarm: <span class='font-weight-bold text-error' v-if='alarm'>{{ hour }}:{{ minute }}</span>
				</v-col>
				<v-col cols='auto' class='ma-0 pa-0'>
					current time: <span class='font-weight-bold text-error'>{{ zeroPad(current_time.hour) }}:{{
						zeroPad(current_time.minute)
					}}:{{ zeroPad(current_time.second) }}</span> <span class='font-weight-bold text-primary'>{{
						time_zone
					}}</span>
				</v-col>

			</v-row>
			<v-row justify='space-between' class='ma-0 pa-0'>

				<v-col cols='auto' class='ma-0 pa-0'>
					backend version: <span class='font-weight-bold'>{{ backend_version }}</span>
				</v-col>

				<v-col cols='auto' class='ma-0 pa-0'>
					frontend version: <span class='font-weight-bold'>{{ env.app_version }}</span>
				</v-col>
			</v-row>
			<v-row justify='space-between' class='ma-0 pa-0'>
				<v-col cols='auto' class='ma-0 pa-0 text'>
					uptime app: <span class='font-weight-bold'>{{ uptime_app }}</span>
				</v-col>

				<v-col cols='auto' class='ma-0 pa-0'>
					uptime ws: <span class='font-weight-bold'>{{ uptime_ws }}</span>
				</v-col>

				<v-col cols='auto' class='ma-0 pa-0'>
					uptime: <span class='font-weight-bold'>{{ uptime }}</span>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import { env } from '@/vanillaTS/env';
import { secondsToText } from '@/vanillaTS/secondsToText';
import { Time } from '@/types';
import { zeroPad } from '@/vanillaTS/zeropad';

const statusStore = statusModule();

const alarm = computed(() => statusStore.alarm);

const hour = computed(() => alarm.value !== undefined ? zeroPad(alarm.value.hour) : 0);

const minute = computed(() => alarm.value !== undefined ? zeroPad(alarm.value.minute) : 0);

const cache = computed(() => statusStore.cache);

const time_zone = computed(() => statusStore.time_zone);

const uptime_app = computed(() => secondsToText(statusStore.uptime_app));

const uptime_ws = computed(() => secondsToText(statusStore.uptime_ws));

const uptime = computed(() => secondsToText(statusStore.uptime));

const backend_version = computed(() => statusStore.version);

defineProps<{ current_time?: Time }>();
</script>