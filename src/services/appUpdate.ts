import { Linking, Platform } from 'react-native';
import { API_BASE_URL } from './api';

export const CURRENT_APP_VERSION = '1.0.13';

export interface AppVersionInfo {
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  title: string;
  message: string;
  playStoreUrl: string;
  playStoreWebUrl: string;
  appStoreUrl: string;
  appStoreWebUrl: string;
}

export const DEFAULT_B2B_VERSION_CONFIG: AppVersionInfo = {
  latestVersion: '1.0.13',
  minVersion: '1.0.13',
  forceUpdate: false,
  title: 'Diwali Festive Update! 🪔',
  message:
    'Celebrate this Diwali with our exclusive new wholesale collection, special festive deals, and improved speed! Please update your app to continue.',
  playStoreUrl: 'market://details?id=com.ethnicsparkles.business',
  playStoreWebUrl: 'https://play.google.com/store/apps/details?id=com.ethnicsparkles.business',
  appStoreUrl: 'itms-apps://apps.apple.com/app/id6802537009',
  appStoreWebUrl: 'https://apps.apple.com/in/app/ethnic-business/id6802537009',
};

/**
 * Compare two semver strings (e.g. "1.0.11" vs "1.0.12").
 * Returns:
 *  -1 if v1 < v2
 *   0 if v1 === v2
 *   1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = String(v1 || '')
    .trim()
    .replace(/^v/, '')
    .split('.')
    .map(n => parseInt(n, 10) || 0);
  const parts2 = String(v2 || '')
    .trim()
    .replace(/^v/, '')
    .split('.')
    .map(n => parseInt(n, 10) || 0);

  const maxLen = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}

export function isUpdateAvailable(
  installedVersion: string = CURRENT_APP_VERSION,
  targetVersion: string = DEFAULT_B2B_VERSION_CONFIG.latestVersion,
): boolean {
  return compareVersions(installedVersion, targetVersion) < 0;
}

/**
 * Fetch latest app version config from backend API.
 */
export async function fetchAppVersionConfig(): Promise<AppVersionInfo> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE_URL}config/app-version?app=b2b`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        return {
          ...DEFAULT_B2B_VERSION_CONFIG,
          ...json.data,
        };
      }
    }
  } catch (e) {
    // Silently fall back to default configuration
  }
  return DEFAULT_B2B_VERSION_CONFIG;
}

/**
 * Redirects the user directly to the Play Store (Android) or App Store (iOS).
 */
export async function openAppStore(config: AppVersionInfo = DEFAULT_B2B_VERSION_CONFIG): Promise<void> {
  const isIos = Platform.OS === 'ios';
  const nativeUrl = isIos ? config.appStoreUrl : config.playStoreUrl;
  const webUrl = isIos ? config.appStoreWebUrl : config.playStoreWebUrl;

  try {
    const supported = await Linking.canOpenURL(nativeUrl);
    if (supported) {
      await Linking.openURL(nativeUrl);
      return;
    }
  } catch (_) {
    // Native scheme failed, fall through to web store URL
  }

  try {
    await Linking.openURL(webUrl);
  } catch (err) {
    console.error('Failed to open app store link:', err);
  }
}

