<template>
	<v-col cols='12' class=''>
		<v-row justify='center' class='ma-0 pa-0 mb-n6' >
			<v-col cols='12' class='ma-0 pa-0'>
				<v-row justify='center' class='ma-0 pa-0'>
					<v-col cols='5'>
						<v-select
							v-model='chosenHour'
							:items='hours'
							bg-color='offwhite'
							color='primary'
							density='compact'
							label='Select Hour'
							variant='outlined'
						/>
					</v-col>
					<v-col cols='5'>
						<v-select
							v-model='chosenMinute'
							:items='minutes'
							bg-color='offwhite'
							color='primary'
							density='compact'
							label='Select Minute'
							variant='outlined'
						/>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-row justify='center' align='center' class='ma-0 pa-0'>

			<v-col cols='auto'>
				<v-btn
					@click='alarm_delete'
					:disabled='!currentAlarm'
					color='error'
					rounded='lg'
					size='small'
					variant='elevated'
				>
					<span class='text-white'>delete alarm</span>
					<v-icon style='vertical-align: middle;' class='ml-2' size='small' :icon='mdiClose' color='white' />
				</v-btn>
			</v-col>

			<v-col cols='auto'>
				<v-btn
					@click='addAlarm'
					:disabled='disabled'
					color='secondary'
					rounded='lg'
					size='small'
					variant='elevated'
				>
					<v-icon style='vertical-align: middle;' class='mr-2' size='small' :icon='mdiAlarmPlus' color='white' />
					<span >{{ buttonAlarmText }} alarm</span>
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script setup lang='ts'>
import { mdiAlarmPlus, mdiClose } from '@mdi/js';
import { zeroPad } from '@/vanillaTS/zeropad';
import type { nu } from '@/types';
import type { Ref } from 'vue';

const [ statusStore, websocketStore ] = [ statusModule(), websocketModule() ];

const emit = defineEmits([ 'close' ]);

const buttonAlarmText = computed((): string => {
	return statusStore.alarm? 'update' : 'add';
});

const currentAlarm = computed(() => {
	return statusStore.alarm;
});

const hours = computed((): Array<{title: string, value: number}> => {
	const hours = [];
	for (const [ index, _item ] of new Array(24).entries()) hours.push({ title: zeroPad(index), value: index });
	return hours;
});
const minutes = computed((): Array<{title: string, value: number}> => {
	const minutes = [];
	for (const [ index, _item ] of new Array(60).entries()) minutes.push({ title: zeroPad(index), value: index });
	return minutes;
});

const chosenHour: Ref<nu> = ref(undefined);
const chosenMinute: Ref<nu> = ref(undefined);

const disabled = computed((): boolean => {
	return !(chosenHour.value !== undefined && chosenHour.value >=0 && chosenMinute.value !== undefined && chosenMinute.value >=0);
});
const addAlarm = () : void => {
	if (chosenHour.value === undefined) return;
	if (chosenMinute.value === undefined) return;
	loadingModule().set_loading(true);
	let body = { hour: chosenHour.value, minute: chosenMinute.value };
	if (statusStore.alarm) {
		websocketStore.send({ name: 'alarm_update', body });
	} else {
		websocketStore.send({ name: 'alarm_add', body });
	}
	emit('close');
};

onMounted((): void => {
	if (currentAlarm.value) {
		chosenHour.value = currentAlarm.value.hour;
		chosenMinute.value = currentAlarm.value.minute;
	}
});

const alarm_delete = (): void => {
	websocketStore.send({ name: 'alarm_delete' });
	emit('close');
};
</script>