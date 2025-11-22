<template>
	<v-col class='' cols='12'>
		<v-row class='ma-0 pa-0 mb-n6' justify='center'>
			<v-col class='ma-0 pa-0' cols='12'>
				<v-row class='ma-0 pa-0' justify='center'>
					<v-col cols='5'>
						<v-select
							v-model='chosenHour'
							bg-color='offwhite'
							color='primary'
							density='compact'
							:items='hours'
							label='Select Hour'
							variant='outlined'
						/>
					</v-col>
					<v-col cols='5'>
						<v-select
							v-model='chosenMinute'
							bg-color='offwhite'
							color='primary'
							density='compact'
							:items='minutes'
							label='Select Minute'
							variant='outlined'
						/>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-row align='center' class='ma-0 pa-0' justify='center'>

			<v-col cols='auto'>
				<v-btn
					color='error'
					:disabled='!currentAlarm'
					rounded='lg'
					size='small'
					variant='elevated'
					@click='alarm_delete'
				>
					<span class='text-white'>delete alarm</span>
					<v-icon
						class='ml-2'
						color='white'
						:icon='mdiClose'
						size='small'
						style='vertical-align: middle;'
					/>
				</v-btn>
			</v-col>

			<v-col cols='auto'>
				<v-btn
					color='secondary'
					:disabled
					rounded='lg'
					size='small'
					variant='elevated'
					@click='addAlarm'
				>
					<v-icon
						class='mr-2'
						color='white'
						:icon='mdiAlarmPlus'
						size='small'
						style='vertical-align: middle;'
					/>
					<span>{{ buttonAlarmText }} alarm</span>
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
</template>

<script setup lang='ts'>
import type { Ref } from 'vue'
import type { nu } from '@/types'
import { mdiAlarmPlus, mdiClose } from '@mdi/js'
import { zeroPad } from '@/vanillaTS/zeropad'

const [statusStore, websocketStore] = [statusModule(), websocketModule()]

const emit = defineEmits(['close'])

const buttonAlarmText = computed(() => statusStore.alarm ? 'update' : 'add')

const currentAlarm = computed(() => statusStore.alarm)

const hours = computed((): Array<{
	title: string
	value: number
}> => {
	const hours = []
	for (const [index, _item] of Array.from({ length: 24 }).entries()) hours.push({
		title: zeroPad(index),
		value: index,
	})
	return hours
})
const minutes = computed((): Array<{
	title: string
	value: number
}> => {
	const minutes = []
	for (const [index, _item] of Array.from({ length: 60 }).entries()) minutes.push({
		title: zeroPad(index),
		value: index,
	})
	return minutes
})

const chosenHour: Ref<nu> = ref(undefined)
const chosenMinute: Ref<nu> = ref(undefined)

const disabled = computed(() => !(chosenHour.value !== undefined && chosenHour.value >= 0 && chosenMinute.value !== undefined && chosenMinute.value >= 0))
function addAlarm (): void {
	if (chosenHour.value === undefined) return
	if (chosenMinute.value === undefined) return
	loadingModule().set_loading(true)
	const body = {
		hour: chosenHour.value,
		minute: chosenMinute.value,
	}
	if (statusStore.alarm) {
		websocketStore.send({
			name: 'alarm_update',
			body,
		})
	} else {
		websocketStore.send({
			name: 'alarm_add',
			body,
		})
	}
	emit('close')
}

onMounted((): void => {
	if (currentAlarm.value) {
		chosenHour.value = currentAlarm.value.hour
		chosenMinute.value = currentAlarm.value.minute
	}
})

function alarm_delete (): void {
	websocketStore.send({ name: 'alarm_delete' })
	emit('close')
}
</script>
