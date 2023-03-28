import { useQuery } from 'react-query';

import { AccountsStats, AccountsStatsDTO } from '@features/account/type';

export const fetchAccountsStats = (): Promise<AccountsStatsDTO> =>
  fetch(`/api/accounts/stats`).then((res) => res.json());

export const useGetAccountsStats = (): { areAccountsStatsLoading: boolean; accountsStats: AccountsStats } => {
  const { data: accountsStats, isLoading: areAccountsStatsLoading } = useQuery<
    AccountsStatsDTO,
    unknown,
    AccountsStats
  >(['accounts', 'stats'], fetchAccountsStats, {
    select: (rawData) => ({
      ...rawData,
      usable: rawData.total - rawData.banned - rawData.warned - rawData.suspended - rawData.disabled - rawData.invalid,
    }),
  });

  return {
    areAccountsStatsLoading,
    accountsStats: accountsStats || {
      total: 0,
      banned: 0,
      invalid: 0,
      suspended: 0,
      warned: 0,
      usable: 0,
      disabled: 0,
    },
  };
};
