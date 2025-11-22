import { defineStore } from 'pinia'
import router from '@/router'
import { snackError } from '@/services/snack'
import { loadingModule } from '@/store/loading'
import { ModuleName } from '@/types/const_module'
import { FrontendRoutes } from '@/types/const_routes'
import { websocketModule } from './websocket'

export const userModule = defineStore(ModuleName.USER, {

	state: () => ({ authenticated: false }),

	actions: {
		logout (message?: string): void {
			this.authenticated = false
			loadingModule().set_loading(false)
			websocketModule().closeWS()
			if (message) {
				snackError({ message })
			}
			router.push(FrontendRoutes.LOGIN)
		},

		set_authenticated (value: boolean) {
			this.authenticated = value
		},
	},
})
