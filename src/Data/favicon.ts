export const faviconFromUrl = (url: string): string => {
  let domainUrl: URL = new URL(url);
  const domain = domainUrl.hostname.replace('www.', '');
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
};
