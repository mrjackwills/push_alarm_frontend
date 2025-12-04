<template>
	<v-col class='' cols='12'>
		<v-row align='center' class='no-gutters' justify='space-around'>
			<v-col cols='auto mb-2'>
				<p class='text-center' :class='confirmFont'>{{ computedTimezoneText }}</p>
			</v-col>
		</v-row>
		<v-form autocomplete='off' method='post' @submit.prevent>
			<v-row align='center' justify='space-around' no-gutters>
				<v-col cols='5'>
					<v-select
						v-model='timeZoneRegion'
						bg-color='offwhite'
						color='primary'
						density='compact'
						:items='parents'
						label='Region'
						variant='outlined'
					/>
				</v-col>
				<v-col cols='5'>
					<v-select
						v-model='timeZoneCity'
						bg-color='offwhite'
						color='primary'
						density='compact'
						item-text='text'
						item-value='value'
						:items='computedCity'
						label='City'
						no-data-text='Select a region first'
						variant='outlined'
					/>
				</v-col>
			</v-row>
			<v-row align='center' justify='space-around' no-gutters>
				<v-col cols='auto'>
					<v-row class='' justify='center'>
						<v-col class='' cols='auto'>
							<v-btn
								color='secondary'
								:disabled='localLoading || !timeZoneCity'
								rounded='lg'
								size='small'
								variant='elevated'
								@click='setTimeZone'
							>
								<v-icon class='mr-1' :icon='mdiUpdate' style='vertical-align: middle;' />
								<span>update</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-form>
	</v-col>
</template>

<script setup lang='ts'>
import type { ComputedCity, su } from '@/types'
import { mdiUpdate } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { parents, zones } from '@/utils/timezone'

const { mobile } = useDisplay()
const [loadingStore, websocketStore] = [loadingModule(), websocketModule()]
const emit = defineEmits(['close'])

onUnmounted(() => {
	clearTimeout(timezoneTimeout.value);
	[timeZoneRegion.value, timeZoneCity.value] = [undefined, undefined]
})

const computedTimeZone = computed(() => timeZoneCity.value ? new Date().toLocaleString('en-GB', { timeZone: timeZoneCity.value }) : '')
const computedCity = computed((): Array<ComputedCity> => {
	if (!timeZoneRegion.value) return []
	const data = []
	for (const i of zones) if (i.startsWith(timeZoneRegion.value)) data.push({
		value: i,
		title: i.slice(Math.max(0, timeZoneRegion.value.length + 1)).replace('_', ' '),
	})
	return data
})
const computedTimezoneText = computed(() => timeZoneRegion.value
	? (timeZoneCity.value
		? `Change to : ${timeZoneCity.value} ${computedTimeZone.value}`
		: 'Now select a city')
	: 'To change time zone, first select a region')
const confirmFont = computed(() => mobile.value ? 'text-caption' : 'text-body-1')
const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})

const localLoading = ref(false)
const timeZoneCity: Ref<su> = ref(undefined)
const timeZoneRegion: Ref<su> = ref(undefined)
const timezoneTimeout = ref(0)

function setTimeZone (): void {
	if (!timeZoneCity.value || loading.value) return;
	[localLoading.value, loading.value] = [true, true]
	websocketStore.send({
		name: 'time_zone',
		body: { zone: timeZoneCity.value },
	})
	emit('close')
}

</script>
