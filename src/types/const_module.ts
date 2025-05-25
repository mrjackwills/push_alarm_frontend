export const ModuleName = {
	BROWSER: 'browser',
	LOADING: 'loading',
	SETTINGS: 'settings',
	SNACKBAR: 'snackbar',
	STATUS: 'status',
	USER: 'user',
	WEBSOCKET: 'websocket'
} as const;

export type ModuleName = (typeof ModuleName)[keyof typeof ModuleName];
