export interface Account {
  banned: boolean;
  invalid: boolean;
  id: string;
  in_use: boolean;
  level: number;
  password: string;
  suspended: boolean;
  suspended_message_acknowledged: boolean;
  username: string;
  warn: boolean;
  warn_expiration_ms: number;
  warn_message_acknowledged: boolean;
  disabled: boolean;
  last_disabled: number;
  last_suspended: number;
  last_banned: number;
}

export interface AccountsStatsDTO {
  total: number;
  banned: number;
  invalid: number;
  suspended: number;
  warned: number;
  disabled: number;
}

export interface AccountsStats extends AccountsStatsDTO {
  usable: number;
}

export interface LevelStats {
  level: number;
  count: number;
  warn: number;
  suspended: number;
  banned: number;
  invalid: number;
  disabled: number;
}
