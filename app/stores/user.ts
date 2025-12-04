import { snackError } from '@/services/snack'
import { loadingModule } from '@/stores/loading'
import { StoreNames } from '@/types'

export const userModule = defineStore(StoreNames.USER, {

	state: () => ({ authenticated: false }),

	actions: {
		logout (message?: string): void {
			this.authenticated = false
			loadingModule().set_loading(false)
			websocketModule().closeWS()
			if (message) {
				snackError({ message })
			}
		},

		set_authenticated (value: boolean) {
			this.authenticated = value
		},
	},
})
