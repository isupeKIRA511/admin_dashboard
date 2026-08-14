import { fetchApi } from '../lib/apiClient';

export interface Settings {
  platformName: string;
  defaultCommission: number;
  settlementFrequency: string;
  autoApproveVendors: boolean;
}

export const getSettings = () => fetchApi<Partial<Settings>>('/settings');

export const updateSettings = (settings: Settings) => fetchApi('/settings', 'PUT', settings);
