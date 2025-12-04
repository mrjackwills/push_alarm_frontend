<template>
	<v-row
		align='center'
		class='fill-height ma-0 pa-0'
		justify='center'
		no-gutters
	>
		<v-col class='ma-0 pa-0' cols='12'>

			<v-row
				v-if='showQr'
				align='center'
				class='ma-0 pa-0'
				justify='center'
				no-gutters
			>
				<v-col class='ma-0 pa-0' cols='12'>
					<v-expand-transition>
						<QRCode v-if='showQr' :timeout-limit='120' />
					</v-expand-transition>
				</v-col>
				<v-col class='ma-0 pa-0' cols='auto'>
					<v-btn color='secondary' @click='toggleQR'>back</v-btn>
				</v-col>
			</v-row>

			<v-row v-else align='center' justify='center' no-gutters>
				<v-col cols='9' md='5'>
					<v-form autocomplete='off' @submit.prevent>
						<v-row class='ma-0 pa-0' justify='center'>
							<v-col class='ma-0 pa-0' cols='12'>
								<v-text-field
									v-model='password'
									bg-color='offwhite'
									class='ma-0 pa-0'
									clearable
									:disabled='loading'
									:error='passwordError'
									:error-messages='passwordError ? "incorrect password" : ""'
									label='password required'
									persistent-hint
									:prepend-inner-icon='eyeIcon'
									:type='inputType'
									variant='outlined'
									@click:clear='password=""'
									@click:prepend-inner='prependClick'
									@keydown.enter='login'
								/>
							</v-col>
							<v-col class='ma-0 pa-0' cols='12'>
								<v-row class='ma-0 pa-0' justify='space-around'>
									<v-col class='ma-0 pa-0' cols='auto'>
										<v-btn
											color='error'
											:disabled='loading'
											rounded='lg'
											variant='elevated'
											@click='toggleQR'
										>
											emergency
										</v-btn>
									</v-col>
									<v-col class='ma-0 pa-0' cols='auto'>
										<v-btn
											color='primary'
											:disabled='buttonDisabled'
											rounded='lg'
											:variant='buttonVariant'
											@click='login'
										>
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
</template>

<script setup lang="ts">
import type { VBtn } from 'vuetify/components/VBtn'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { axiosRequests } from '@/services/axios'
import { snackReset } from '@/services/snack'
import { browserModule } from '@/stores/browser'
import { loadingModule } from '@/stores/loading'

const loadingStore = loadingModule()

const pageTitle = 'login'

onMounted(() => {
	browserModule().set_description(pageTitle)
	browserModule().set_title(pageTitle)
})

const showQr = ref(false)

function toggleQR (): void {
	showQr.value = !showQr.value
	if (showQr.value) {
		password.value = ''
		passwordError.value = false
		passwordVisible.value = false
	}
}

// Change the title and description when in emergency mode
watch(showQr, i => {
	const title = i ? 'emergency mode' : pageTitle
	browserModule().set_title(title)
	browserModule().set_description(title)
})

const buttonDisabled = computed(() => loading.value || password.value.length === 0 || passwordError.value)

const buttonVariant = computed((): VBtn['$props']['variant'] => buttonDisabled.value ? 'outlined' : 'elevated')

const loading = computed({
	get (): boolean {
		return loadingStore.loading
	},
	set (b: boolean): void {
		loadingStore.set_loading(b)
	},
})

const passwordVisible = ref(false)
const password = ref('')
const passwordError = ref(false)

const eyeIcon = computed(() => passwordVisible.value ? mdiEyeOff : mdiEye)
const inputType = computed(() => passwordVisible.value ? 'text' : 'password')
function prependClick (): void {
	if (loading.value) return
	passwordVisible.value = !passwordVisible.value
}

watch(password, _ => {
	if (passwordError.value) {
		passwordError.value = false
	}
})

async function login (): Promise<void> {
	if (!password.value) return
	passwordVisible.value = false
	loading.value = true
	const response = await axiosRequests.wsAuth_post(password.value)
	loading.value = false
	if (response) {
		password.value = ''
		snackReset()
	} else {
		passwordError.value = true
	}
}

</script>

<style scoped>
.v-messages__message {
	color: var(--v-theme-error) !important;
}
</style>
