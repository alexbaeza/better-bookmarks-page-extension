import { APP_FAVICON_URL } from '@/config/constants';
import { getDefaultFavicon } from './browser/utils/default-favicon';

export const faviconFromUrl = (url: string): string => {
  try {
    const domainUrl: URL = new URL(url);
    const domain = domainUrl.hostname.replace('www.', '');
    return APP_FAVICON_URL.replace('{domain}', domain);
  } catch {
    return getDefaultFavicon();
  }
};
