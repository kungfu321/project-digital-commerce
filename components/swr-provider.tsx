'use client';

import { SWRConfig } from 'swr';

import { fetcher } from '@/lib/request';

export const SWRProvider = (props: { children: React.ReactNode }) => {
  return <SWRConfig
    value={{
      refreshInterval: 0,
      fetcher
    }}
  >
    {props.children}
  </SWRConfig>
};
