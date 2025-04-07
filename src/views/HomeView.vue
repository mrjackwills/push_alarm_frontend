<template>
	<v-container class='fill-height' fluid>

		<v-row justify='center'>
			<v-col cols='12' md='6' v-if='init' class='abc'>

				<AlarmStatus :current_time='current_time' />

				<template v-if='!cache'>
					<v-row justify='center' class=''>
						<v-col cols='12'>
							<v-btn color='primary' block @click='showAlarm = !showAlarm' rounded='lg'>
								<v-row justify='space-between' align='center' class='ma-0 pa-0'>
									<v-col cols='auto' class='ma-0 pa-0'>
										{{ buttonAlarmText }} alarm
									</v-col>
									<v-col cols='auto' class='ma-0 pa-0'>
										<v-icon :icon='showAlarm ? mdiChevronUp : mdiChevronDown' />
									</v-col>
								</v-row>
							</v-btn>
						</v-col>
					</v-row>

					<v-expand-transition>
						<EditAlarm v-if='showAlarm' @close='showAlarm = false' />
					</v-expand-transition>

					<v-row justify='center'>
						<v-col cols='12'>

							<v-btn color='primary' block @click='showTimeZone = !showTimeZone' rounded='lg'>
								<v-row justify='space-between' align='center' class='ma-0 pa-0'>
									<v-col cols='auto' class='ma-0 pa-0'>
										timezone
									</v-col>
									<v-col cols='auto' class='ma-0 pa-0'>
										<v-icon :icon='showTimeZone ? mdiChevronUp : mdiChevronDown' />
									</v-col>
								</v-row>
							</v-btn>

						</v-col>
					</v-row>

					<v-expand-transition>
						<TimeZone v-if='showTimeZone' @close='showTimeZone = false' />
					</v-expand-transition>

					<v-row justify='center'>
						<v-col cols='12'>
							<v-btn color='primary' block @click='showTestRequest = !showTestRequest' rounded='lg'>
								<v-row justify='space-between' align='center' class='ma-0 pa-0'>
									<v-col cols='auto' class='ma-0 pa-0'>
										test request
									</v-col>
									<v-col cols='auto' class='ma-0 pa-0'>
										<v-icon :icon='showTestRequest ? mdiChevronUp : mdiChevronDown' />
									</v-col>
								</v-row>
							</v-btn>
						</v-col>
					</v-row>

					<v-expand-transition>
						<TestRequest v-if='showTestRequest' @close='showTestRequest = false' />
					</v-expand-transition>

				</template>

				<v-row justify='center'>
					<v-col cols='12'>
						<v-btn color='primary' block @click='toggleQR' rounded='lg'>
							<v-row justify='space-between' align='center' class='ma-0 pa-0'>
								<v-col cols='auto' class='ma-0 pa-0'>
									{{ qrButton }} QR
								</v-col>
								<v-col cols='auto' class='ma-0 pa-0'>
									<v-icon :icon='showTestRequest ? mdiChevronUp : mdiChevronDown' />
								</v-col>
							</v-row>
						</v-btn>
					</v-col>
					<v-expand-transition>
						<QRCode v-if='showQr' :timeout_limit='60' />
					</v-expand-transition>
				</v-row>
			</v-col>
			<v-col cols='auto' v-else>
				<v-progress-circular indeterminate color='primary' :size='256' :width='24' />
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { parseMessage } from '@/vanillaTS/messageParser';
import { snackError } from '@/services/snack';
import { ws } from '@/services/WS';
import type { Time, WsIncoming } from '@/types';

const [loadingStore, statusStore, websocketStore] = [loadingModule(), statusModule(), websocketModule()];

const pageTitle = '';

onMounted(() => {
	browserModule().set_description(``);
	browserModule().set_title(pageTitle);
	init_time_interval();
});

onUnmounted(() => {
	clearTimeout(time_timeout.value);
});

const cache = computed(() => statusStore.cache);

/// QR Code methods

const showQr = ref(false);
const toggleQR = (): void => {
	showQr.value = !showQr.value;
};

const qrButton = computed(() => showQr.value ? 'hide' : 'show');

/// Show components
const showAlarm = ref(false);
const showTestRequest = ref(false);
const showTimeZone = ref(false);

const buttonAlarmText = computed(() => statusStore.alarm ? 'update' : 'add');

const init = computed(() => statusStore.init);

const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});

const current_time = ref(undefined as undefined | Time);

/// Time methods
const time_zone = computed(() => statusStore.time_zone);
const time_timeout = ref(0);

const set_time = (): void => {
	const tzOptions: Intl.DateTimeFormatOptions = {
		timeZone: time_zone.value.length > 1 ? time_zone.value : 'Etc/UTC',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false
	};
	const tempDate = new Intl.DateTimeFormat([], tzOptions);
	const formattedDate = tempDate.format(new Date());
	current_time.value = {
		hour: Number(formattedDate.toString().substring(0, 2)),
		minute: Number(formattedDate.toString().substring(3, 5)),
		second: Number(formattedDate.toString().substring(6, 8))
	};
};

/// Update the current_time value every second
const init_time_interval = (): void => {
	clearInterval(time_timeout.value);
	set_time();
	time_timeout.value = window.setInterval(() => {
		set_time();
		statusStore.increase_uptimes();
	}, 1000);

};

/// Web socket methods
const ws_connected = computed(() => websocketStore.connected);

/// Request the status of the server
const send_status = (): void => {
	websocketStore.send({ name: 'status' });
};

watch(ws_connected, (i: boolean) => {
	if (i) {
		addWSHandlers();
		send_status();
	}
});

const addWSHandlers = (): void => {
	ws.connection?.addEventListener('message', (data) => {
		try {
			const message = parseMessage(data.data);
			if (!message) throw Error(`can't parse message`);
			wsDataHandler(message);
		} catch (e) {
			const message = e instanceof Error ? e.message : 'ERROR';
			snackError({ message });
		}
	});

	send_status();

	// Although should never have the connection killed
	ws.connection?.addEventListener('close', (_event) => {
		userModule().logout();
	});
};

// should have an array,
const wsDataHandler = async (message: WsIncoming): Promise<void> => {
	loading.value = false;
	statusStore.set_cache(!!message.cache);
	statusStore.toggle_init();
	switch (message.data?.name) {
		case 'status': {
			if (message.data.data) statusStore.set_from_status(message.data.data);
			init_time_interval();
			break;
		}

		case 'error': {
			await snackError({ message: message.data.data });
			break;
		}
	}
};

</script>

<style>
.v-btn__content {
	width: 100%
}
</style>