import type { wsOutGoing } from '@/types'
import { defineStore } from 'pinia'
import { ws } from '@/services/WS'
import { userModule } from '@/stores/user'
import { StoreNames } from '@/types'

export const websocketModule = defineStore(StoreNames.WEBSOCKET, {

	state: () => ({ connected: false }),

	actions: {

		closeWS (): void {
			this.set_connected(false)
			ws.closeWs()
		},

		openWs (password: string): void {
			const user_store = userModule()
			if (!user_store.authenticated) {
				return
			}
			ws.openWs(password)
			ws.connection?.addEventListener('open', () => {
				this.set_connected(true)
			})
		},

		send (data: wsOutGoing): void {
			ws.connection?.send(JSON.stringify({
				data,
				unique: true,
			}))
		},

		set_connected (b: boolean): void {
			this.connected = b
		},
	},
})
