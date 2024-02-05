import { defineStore } from 'pinia';
import { ModuleName } from '@/types/enum_module';
import type { ModelAlarm, Status } from '@/types';

export const statusModule = defineStore(ModuleName.STATUS, {

	state: () => ({
		alarm: undefined as undefined | ModelAlarm,
		cache: true,
		time_zone: '',
		uptime_app: 0,
		uptime_ws: 0,
		uptime: 0,
		version: '',
		init: false,
	}),

	actions: {
		set_alarm (x: undefined | ModelAlarm) {
			this.alarm = x;
		},

		set_cache (x: boolean) {
			this.cache = x;
		},

		set_time_zone (x: string) {
			this.time_zone = x;
		},
		set_uptime (x: number) {
			this.uptime = x;
		},
		set_uptime_app (x: number) {
			this.uptime_app = x;
		},
		set_uptime_ws (x: number) {
			this.uptime_ws = x;
		},
		set_version (x: string) {
			this.version = x;
		},

		/// Set all values
		set_from_status (x: Status) {
			this.set_alarm(x.alarm);
			this.set_time_zone(x.time_zone);
			this.set_uptime(x.uptime);
			this.set_uptime_app(x.uptime_app);
			this.set_uptime_ws(x.uptime_ws);
			this.set_version(x.version);
		},

		toggle_init () {
			this.init = true;
		},

		/// Increase the uptimes by one second
		increase_uptimes () {
			if (!this.cache) {
				this.uptime++;
				this.uptime_app++;
				this.uptime_ws++;
			}
		}

	}
});