<template>
	<v-col class='' cols='12'>
		<v-row align='center' class='ma-0 pa-0' justify='center'>
			<v-col class='ma-0 pa-0 mb-n6' cols='12'>
				<v-text-field
					v-model='message'
					bg-color='offwhite'
					class='ma-0 pa-0'
					clearable
					counter
					density='compact'
					:disabled='cache'
					:error='error.length > 0'
					label='message to send'
					maxlength='100'
					persistent-hint
					:prepend-inner-icon='mdiMessageText'
					variant='outlined'
					@keydown.enter='send'
				/>
			</v-col>
		</v-row>

		<v-row align='center' class='ma-0 pa-0' justify='center'>
			<v-col cols='auto'>
				<v-btn
					color='error'
					:disabled='cache || !message || message.length === 0 || message.length > 100'
					rounded='lg'
					size='small'
					variant='elevated'
					@click='send'
				>
					<v-icon class='mr-2' :icon='mdiSend' size='small' style='vertical-align: middle;' />
					Send message
				</v-btn>
			</v-col>
		</v-row>
	</v-col>

</template>

<script setup lang="ts">
import { mdiMessageText, mdiSend } from '@mdi/js'

const [websocketStore] = [websocketModule()]

const emit = defineEmits(['close'])

const message = ref('')
const error = ref('')

// Send the test request, if cached then offline
function send (): void {
	if (!cache.value && message.value.length > 0 && message.value.length <= 100) {
		websocketStore.send({
			name: 'test_request',
			body: { message: message.value },
		})
		emit('close')
	}
}

const cache = computed(() => statusModule().cache)

</script>
