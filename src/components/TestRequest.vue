<template>
	<v-col cols='12' class=''>
		<v-row align='center' justify='center' class='ma-0 pa-0'>
			<v-col cols='12' class='ma-0 pa-0 mb-n6'>
				<v-text-field
					v-model='message'
					@keydown.enter='send'
					:error='error.length >0'
					:disabled='cache'
					:prepend-inner-icon='mdiMessageText '
					bg-color='offwhite'
					class='ma-0 pa-0'
					density='compact'
					label='message to send'
					maxlength='100'
					variant='outlined'
					clearable
					counter
					persistent-hint
				/>
			</v-col>
		</v-row>
		
		<v-row align='center' justify='center' class='ma-0 pa-0'>
			<v-col cols='auto'>
				<v-btn
					@click='send'
					:disabled='cache|| !message || message.length === 0 || message.length > 100'
					color='error'
					rounded='lg'
					size='small'
					variant='elevated'
				>
					<v-icon style='vertical-align: middle;' class='mr-2' size='small' :icon='mdiSend' />
					Send message
				</v-btn>
			</v-col>
		</v-row>
	</v-col>
		
</template>

<script setup lang="ts">
import { mdiMessageText, mdiSend } from '@mdi/js';

const [ websocketStore, ] = [ websocketModule() ];

const emit = defineEmits([ 'close' ]);

const message = ref('');
const error = ref('');

/// Send the test request, if cached then offline
const send = (): void => {
	if (!cache.value && message.value.length > 0 && message.value.length <= 100) {
		websocketStore.send({ name: 'test_request', body: { message: message.value } });
		emit('close');
	}
};

const cache = computed(() => {
	return statusModule().cache;
});

</script>

<style>
</style>