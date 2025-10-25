import { getDefaultFavicon } from './browser/utils/default-favicon';

export const faviconFromUrl = (url: string): string => {
  try {
    const domainUrl: URL = new URL(url);
    const domain = domainUrl.hostname.replace('www.', '');
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return getDefaultFavicon();
  }
};
