import { create } from 'zustand';
import { settingsService } from '../services/settings';

interface SettingsState {
  profile: Profile | null;
  sessions: Session[];
  twoFactor: TwoFactorMethod | null;
  notificationPreferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  setup2FA: (method: '2FA_APP' | 'SMS' | 'EMAIL') => Promise<void>;
  verify2FA: (token: string) => Promise<void>;
  disable2FA: (token: string) => Promise<void>;
  fetchSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllSessions: () => Promise<void>;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  profile: null,
  sessions: [],
  twoFactor: null,
  notificationPreferences: null,
  loading: false,
  error: null,

  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await settingsService.updateProfile(data);
      set({ profile: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // ... implement other methods similarly
})); 