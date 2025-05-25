export type u<T> = T | undefined;
export type nu = u<number>;
export type su = u<string>;

export type Snack = {
	message?: string;
	icon?: string;
	timeout?: number;
	closable?: boolean;
	loading?: boolean;
} & Partial<SnackPosition>;

export type Positions = 'bottom' | 'left' | 'right' | 'top';

export type SnackPosition = {
	x: u<Positions>;
	y: u<Positions>;
};

export type ConvertBytes = {
	total: string;
	unit: 'GB' | 'MB' | 'kB';
};

export type Error = {
	message: string;
	code: number;
};

export type ModelAlarm = Record<'hour' | 'minute', number>;

export type Time = ModelAlarm & { second: number };

type IncomingNameData<T extends IncomingMessageName, U> = {
	name: T;
	data?: U;
};
type OutgoingNameData<T extends OutgoingMessageName, U> = {
	name: T;
	body?: U;
};

type OutgoingMessageName = 'status' | 'alarm_add' | 'alarm_delete' | 'alarm_dismiss' | 'alarm_update' | 'test_request' | 'time_zone';
type IncomingMessageName = 'status' | 'error';

export type Status = Record<'time_zone' | 'version', string>
  & Record<'uptime' | 'uptime_app' | 'uptime_ws', number>
  & { alarm: undefined | ModelAlarm };

export type ComputedCity = Record<'value' | 'title', string>;

export type WsIncoming = {
	data?: IncomingNameData<'status', Status> | IncomingNameData<'error', string>;
	cache?: boolean;
	unique?: boolean;
	error?: Error;
};

export type wsOutGoing = OutgoingNameData<'status', undefined> |
  OutgoingNameData<'alarm_add', ModelAlarm> |
  OutgoingNameData<'alarm_update', ModelAlarm> |
  OutgoingNameData<'alarm_delete', undefined> |
  OutgoingNameData<'alarm_dismiss', undefined> |
  OutgoingNameData<'test_request', { message: string }> |
  OutgoingNameData<'time_zone', { zone: string }>;
