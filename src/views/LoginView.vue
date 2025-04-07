<template>
	<v-container class='fill-height ma-0 pa-0' fluid>

		<v-row align='center' justify='center' no-gutters class='fill-height ma-0 pa-0'>
			<v-col cols='12' class='ma-0 pa-0'>

				<v-row align='center' justify='center' no-gutters v-if='showQr' class='ma-0 pa-0'>
					<v-col cols='12' class='ma-0 pa-0'>
						<v-expand-transition>
							<QRCode v-if='showQr' :timeout_limit='120' />
						</v-expand-transition>
					</v-col>
					<v-col cols='auto' class='ma-0 pa-0'>
						<v-btn @click='toggleQR' color='secondary'>back</v-btn>
					</v-col>
				</v-row>

				<v-row align='center' justify='center' no-gutters v-else>
					<v-col cols='9' md='5'>
						<v-form v-on:submit.prevent autocomplete='off'>
							<v-row class='ma-0 pa-0' justify='center'>
								<v-col cols='12' class='ma-0 pa-0'>
									<v-text-field v-model='password' @click:prepend-inner='prependClick'
										@keydown.enter='login' :error='passwordError'
										:error-messages='passwordError ? "incorrect password" : ""'
										:prepend-inner-icon='eyeIcon' :type='inputType' bg-color='offwhite'
										class='ma-0 pa-0' label='password required' variant='outlined' clearable
										persistent-hint />
								</v-col>
								<v-col cols='12' class='ma-0 pa-0'>
									<v-row class='ma-0 pa-0' justify='space-around'>
										<v-col cols='auto' class='ma-0 pa-0'>
											<v-btn @click='toggleQR' :disabled='loading' color='error' rounded='lg'
												variant='elevated'>
												emergency
											</v-btn>
										</v-col>
										<v-col cols='auto' class='ma-0 pa-0'>
											<v-btn @click='login' :disabled='buttonDisabled' :variant='buttonVariant'
												color='primary' rounded='lg'>
												login
											</v-btn>
										</v-col>

									</v-row>
								</v-col>
							</v-row>
						</v-form>
					</v-col>
				</v-row>

			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { axiosRequests } from '@/services/axios';
import { FrontendRoutes } from '@/types/const_routes';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { snackReset } from '@/services/snack';
import { useRouter } from 'vue-router';
import type { VBtn } from 'vuetify/components/VBtn';

const router = useRouter();
const loadingStore = loadingModule();

const pageTitle = 'login';

onMounted(() => {
	browserModule().set_description(pageTitle);
	browserModule().set_title(pageTitle);
});

const showQr = ref(false);

const toggleQR = (): void => {
	showQr.value = !showQr.value;
	if (showQr.value) {
		password.value = '';
		passwordError.value = false;
		passwordVisible.value = false;
	}
};

/// Change the title and description when in emergency mode
watch(showQr, (i) => {
	const title = i ? 'emergency mode' : pageTitle;
	browserModule().set_title(title);
	browserModule().set_description(title);
});

const buttonDisabled = computed(() => loading.value || password.value.length < 1 || passwordError.value);

const buttonVariant = computed((): VBtn['$props']['variant'] => buttonDisabled.value ? 'outlined' : 'elevated');

const loading = computed({
	get (): boolean {
		return loadingStore.loading;
	},
	set (b: boolean): void {
		loadingStore.set_loading(b);
	}
});

const passwordVisible = ref(false);
const password = ref('');
const passwordError = ref(false);

const eyeIcon = computed(() => passwordVisible.value ? mdiEyeOff : mdiEye);
const inputType = computed(() => passwordVisible.value ? 'text' : 'password');
const prependClick = (): void => {
	if (loading.value) return;
	passwordVisible.value = !passwordVisible.value;
};

watch(password, (_) => {
	if (passwordError.value) {
		passwordError.value = false;
	}
});

const login = async (): Promise<void> => {
	if (!password.value) return;
	passwordVisible.value = false;
	loading.value = true;
	const response = await axiosRequests.wsAuth_post(password.value);
	loading.value = false;
	if (response) {
		password.value = '';
		snackReset();
		router.push(FrontendRoutes.BASE);
	} else {
		passwordError.value = true;
	}
};

</script>

<style scoped>
.v-messages__message {
	color: var(--v-theme-error) !important;
}
</style>