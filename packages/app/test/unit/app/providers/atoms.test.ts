import { describe, expect, it } from 'vitest';

import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom,
  greetingEnabledAtom,
  greetingNameAtom,
  setZoomAtom,
  sidebarEnabledAtom,
  themeAtom,
  viewModeAtom,
  ZOOM_MAX_VALUE,
  ZOOM_MIN_VALUE,
  zoomAtom,
} from '@/app/providers/atoms';

describe('atoms', () => {
  it('exports themeAtom', () => {
    expect(typeof themeAtom).toBe('object');
  });

  it('exports backgroundOverlayAtom', () => {
    expect(typeof backgroundOverlayAtom).toBe('object');
  });

  it('exports sidebarEnabledAtom', () => {
    expect(typeof sidebarEnabledAtom).toBe('object');
  });

  it('exports backgroundOverlayOpacityAtom', () => {
    expect(typeof backgroundOverlayOpacityAtom).toBe('object');
  });

  it('exports greetingEnabledAtom', () => {
    expect(typeof greetingEnabledAtom).toBe('object');
  });

  it('exports greetingNameAtom', () => {
    expect(typeof greetingNameAtom).toBe('object');
  });

  it('exports viewModeAtom', () => {
    expect(typeof viewModeAtom).toBe('object');
  });

  it('exports zoomAtom', () => {
    expect(typeof zoomAtom).toBe('object');
  });

  it('exports setZoomAtom', () => {
    expect(typeof setZoomAtom).toBe('object');
  });

  it('has correct zoom constants', () => {
    expect(ZOOM_MIN_VALUE).toBe(0.8);
    expect(ZOOM_MAX_VALUE).toBe(2.0);
  });

  it('setZoomAtom is defined as a write atom', () => {
    expect(typeof setZoomAtom.write).toBe('function');
  });
});
