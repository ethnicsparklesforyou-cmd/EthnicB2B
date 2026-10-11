import { API_BASE_URL } from './api';

export type PromoTickerItem = {
  id?: number;
  icon: string;
  title: string;
  subtitle: string;
  targetApp?: 'retail' | 'b2b' | 'both';
};

export const DEFAULT_B2B_PROMO_ITEMS: PromoTickerItem[] = [
  {
    icon: 'percent-outline',
    title: 'Wholesale Pricing',
    subtitle: 'factory direct rates',
  },
  {
    icon: 'file-document-outline',
    title: 'GST Invoicing',
    subtitle: '100% verified billing',
  },
  {
    icon: 'shield-check-outline',
    title: 'Anti-Tarnish Polish',
    subtitle: 'trusted quality',
  },
  {
    icon: 'truck-fast-outline',
    title: 'Doorstep Shipping',
    subtitle: 'pan-India delivery',
  },
];

/**
 * Fetch active promo ticker points for Business (B2B) app
 */
export async function fetchActivePromoTicker(appType: string = 'b2b'): Promise<PromoTickerItem[]> {
  try {
    const url = `${API_BASE_URL}promo-ticker?app=${appType}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return DEFAULT_B2B_PROMO_ITEMS;
    }

    const json = await response.json();
    const items = json?.data || json?.result || json;

    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.id,
        icon: item.icon || 'tag-outline',
        title: item.title,
        subtitle: item.subtitle || '',
        targetApp: item.targetApp || 'both',
      }));
    }

    return DEFAULT_B2B_PROMO_ITEMS;
  } catch (error) {
    console.warn('Failed to fetch promo ticker from API, using default items:', error);
    return DEFAULT_B2B_PROMO_ITEMS;
  }
}
