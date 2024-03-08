export const faviconFromUrl = (url: string): string => {
  let domainUrl: URL = new URL(url);
  const domain = domainUrl.hostname.replace('www.', '');
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
};
