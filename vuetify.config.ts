import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
	icons: {
		defaultSet: 'mdi-svg',
	},
	theme: {
		cspNonce: process.env.NONCE_PLACEHOLDER,
		defaultTheme: 'light',
		themes: {
			light: {
				colors: {
					primary: '#4f00cf',
					offwhite: '#dedede',
					error: '#ff006c',
					secondary: '#ff7245',
				},
			},
		},
	},
})
