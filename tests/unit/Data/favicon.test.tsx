import { faviconFromUrl } from '../../../src/Data/favicon';

describe('faviconFromUrl', () => {
  it('returns a valid URL when given a valid input URL', () => {
    const url = 'https://www.google.com';
    const expected =
      'https://www.google.com/s2/favicons?domain=google.com&sz=256';
    const actual = faviconFromUrl(url);
    expect(actual).toBe(expected);
  });

  it('removes the "www." subdomain from the input URL hostname', () => {
    const url = 'https://www.example.com';
    const expected =
      'https://www.google.com/s2/favicons?domain=example.com&sz=256';
    const actual = faviconFromUrl(url);
    expect(actual).toBe(expected);
  });
});
