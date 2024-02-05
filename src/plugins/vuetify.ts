import '../sass/variables.scss';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVuetify } from 'vuetify';

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	
	theme: {
		cspNonce: '4dc4f3756b757c7b64b2340378f05c05035afeb1d5c992dc26646633ed9670e17eafbfc0376a765b',
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
});
