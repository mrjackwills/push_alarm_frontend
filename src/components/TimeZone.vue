<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='space-around' class='no-gutters'>
			<v-col cols='auto mb-2'>
				<p class='text-center' :class='confirmFont'>{{ computedTimezoneText }}</p>
			</v-col>
		</v-row>
		<v-form v-on:submit.prevent autocomplete='off' method='post'>
			<v-row align='center' justify='space-around' no-gutters>
				<v-col cols='5'>
					<v-select v-model='timeZoneRegion' :items='parents' bg-color='offwhite' color='primary'
						density='compact' label='Region' variant='outlined' />
				</v-col>
				<v-col cols='5'>
					<v-select v-model='timeZoneCity' :items='computedCity' bg-color='offwhite' color='primary'
						density='compact' item-text='text' item-value='value' label='City'
						no-data-text='Select a region first' variant='outlined' />
				</v-col>
			</v-row>
			<v-row align='center' justify='space-around' no-gutters>
				<v-col cols='auto'>
					<v-row justify='center' class=''>
						<v-col cols='auto' class=''>
							<v-btn @click='setTimeZone' :disabled='localLoading || !timeZoneCity' variant='elevated'
								color='secondary' rounded='lg' size='small'>
								<v-icon style='vertical-align: middle;' class='mr-1' :icon='mdiUpdate' />
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
import { mdiUpdate } from '@mdi/js';
import { parents, zones } from '@/vanillaTS/timezone';
import { useDisplay } from 'vuetify';
import type { Ref } from 'vue';
import type { su, ComputedCity } from '@/types';

const { mobile } = useDisplay();
const [loadingStore, websocketStore] = [loadingModule(), websocketModule()];
const emit = defineEmits(['close']);

onUnmounted(() => {
	clearTimeout(timezoneTimeout.value);
	[timeZoneRegion.value, timeZoneCity.value] = [undefined, undefined];
});

const computedTimeZone = computed(() => !timeZoneCity.value ? '' : new Date().toLocaleString('en-GB', { timeZone: timeZoneCity.value }));
const computedCity = computed((): Array<ComputedCity> => {
	if (!timeZoneRegion.value) return [];
	const data = [];
	for (const i of zones) if (i.startsWith(timeZoneRegion.value)) data.push({
		value: i,
		title: i.substring(timeZoneRegion.value.length + 1).replace('_', ' ')
	});
	return data;
});
const computedTimezoneText = computed(() => !timeZoneRegion.value ? 'To change time zone, first select a region' : !timeZoneCity.value ? 
	'Now select a city' : `Change to : ${timeZoneCity.value} ${computedTimeZone.value}`);
const confirmFont = computed(() => mobile.value ? 'text-caption' : 'text-body-1');
const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});

const localLoading = ref(false);
const timeZoneCity: Ref<su> = ref(undefined);
const timeZoneRegion: Ref<su> = ref(undefined);
const timezoneTimeout = ref(0);

const setTimeZone = (): void => {
	if (!timeZoneCity.value || loading.value) return;
	[localLoading.value, loading.value] = [true, true];
	websocketStore.send({
		name: 'time_zone',
		body: { zone: timeZoneCity.value }
	});
	emit('close');
};

</script>