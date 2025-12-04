<template>
	<v-row align='center' justify='center'>
		<v-col v-if='currentTime' class='text-caption' cols='12'>

			<v-row v-if='cache' class='ma-0 pa-0' justify='center'>
				<v-col class='text-error font-weight-black' cols='auto'>
					OFFLINE CACHED VALUES
				</v-col>
			</v-row>

			<v-row class='ma-0 pa-0' justify='space-between'>
				<v-col class='ma-0 pa-0' cols='auto'>
					alarm: <span v-if='alarm' class='font-weight-bold text-error'>{{ hour }}:{{ minute }}</span>
				</v-col>
				<v-col class='ma-0 pa-0' cols='auto'>
					current time: <span class='font-weight-bold text-error'>{{ zeroPad(currentTime.hour) }}:{{
						zeroPad(currentTime.minute)
					}}:{{ zeroPad(currentTime.second) }}</span> <span class='font-weight-bold text-primary'>{{
						time_zone
					}}</span>
				</v-col>

			</v-row>
			<v-row class='ma-0 pa-0' justify='space-between'>

				<v-col class='ma-0 pa-0' cols='auto'>
					backend version: <span class='font-weight-bold'>{{ backend_version }}</span>
				</v-col>

				<v-col class='ma-0 pa-0' cols='auto'>
					frontend version: <span class='font-weight-bold'>{{ env.app_version }}</span>
				</v-col>
			</v-row>
			<v-row class='ma-0 pa-0' justify='space-between'>
				<v-col class='ma-0 pa-0 text' cols='auto'>
					uptime app: <span class='font-weight-bold'>{{ uptime_app }}</span>
				</v-col>

				<v-col class='ma-0 pa-0' cols='auto'>
					uptime ws: <span class='font-weight-bold'>{{ uptime_ws }}</span>
				</v-col>

				<v-col class='ma-0 pa-0' cols='auto'>
					uptime: <span class='font-weight-bold'>{{ uptime }}</span>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang='ts'>
import type { Time } from '@/types'
import { env } from '@/utils/env'
import { secondsToText } from '@/utils/secondsToText'
import { zeroPad } from '@/utils/zeropad'

const statusStore = statusModule()

const alarm = computed(() => statusStore.alarm)

const hour = computed(() => alarm.value === undefined ? 0 : zeroPad(alarm.value.hour))

const minute = computed(() => alarm.value === undefined ? 0 : zeroPad(alarm.value.minute))

const cache = computed(() => statusStore.cache)

const time_zone = computed(() => statusStore.time_zone)

const uptime_app = computed(() => secondsToText(statusStore.uptime_app))

const uptime_ws = computed(() => secondsToText(statusStore.uptime_ws))

const uptime = computed(() => secondsToText(statusStore.uptime))

const backend_version = computed(() => statusStore.version)

defineProps<{ currentTime?: Time }>()
</script>
