export const faviconFromUrl = (url: string): string => {
  let domainUrl: URL = new URL(url);
  const domain = domainUrl.hostname.replace('www.', '');
  return `https://puny-yellow-llama.faviconkit.com/${domain}/256`;
};
