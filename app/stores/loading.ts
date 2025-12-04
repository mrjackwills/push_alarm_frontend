import { defineStore } from 'pinia'
import { StoreNames } from '@/types'

export const loadingModule = defineStore(StoreNames.LOADING, {

	state: () => ({ loading: false }),

	actions: {
		set_loading (value: boolean) {
			this.loading = value
		},
	},
})
