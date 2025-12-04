<template>
	<v-row align='center' class='ma-0 pa-0' justify='center' no-gutters>

		<v-col class='ma-0 pa-0'>
			<v-row align='center' class='ma-0 pa-0' justify='center'>
				<v-col v-if='timeout === 0' cols='auto'>
					<v-row class='ma-0 pa-0' justify='center'>
						<v-col class='ma-0 pa-0' cols='auto'>
							<QrCode level='H' :size :value='qrCode' />
						</v-col>
					</v-row>
					<v-row class='ma-0 pa-0' justify='center'>
						<v-col v-if='wsConnected' class='ma-0 pa-0' cols='auto'>
							<v-btn
								color='secondary'
								rounded='lg'
								size='small'
								variant='elevated'
								@click='dismiss'
							>
								<v-icon
									class='mr-2'
									color='white'
									:icon='mdiPower'
									size='small'
									style='vertical-align: middle;'
								/>
								<span class='text-white'>dismiss alarm</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>

				<v-col v-else cols='auto text-black ltext  ma-0 pa-0'>
					{{ zeroPadTimeout }}
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script setup lang="ts">
import { mdiPower } from '@mdi/js'
import { useDocumentVisibility } from '@vueuse/core'
import QrCode from 'qrcode.vue'
import { useDisplay } from 'vuetify'
import { zeroPad } from '@/utils/zeropad'

const websocketStore = websocketModule()

const visibility = useDocumentVisibility()

const { mobile } = useDisplay()

const interval = ref(0)
const timeout = ref(-1)

function reset_timer (): void {
	timeout.value = props.timeoutLimit
	clearInterval(interval.value)
	interval.value = window.setInterval(() => {
		if (timeout.value <= 0) {
			clearInterval(interval.value)
		} else {
			timeout.value -= 1
		}
	}, 1000)
}

const qrCode = `https://alarm.mrjackwills.com`

const size = computed(() => Math.floor(window.innerWidth / 4))

const zeroPadTimeout = computed(() => zeroPad(timeout.value))

const wsConnected = computed(() => websocketStore.connected)

function dismiss (): void {
	if (wsConnected.value) {
		websocketStore.send({ name: 'alarm_dismiss' })
	}
}

watch(mobile, i => {
	if (i) {
		reset_timer()
	}
})

watch(visibility, (current, previous) => {
	if (current === 'visible' && previous === 'hidden') {
		reset_timer()
	}
})

onMounted(() => {
	reset_timer()
})

const props = defineProps<{ timeoutLimit: number }>()

</script>

<style>
.ltext {
	font-size: 12rem;
}
</style>
