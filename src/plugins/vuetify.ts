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
