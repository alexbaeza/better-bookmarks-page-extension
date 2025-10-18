import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom,
  greetingEnabledAtom,
  greetingNameAtom,
  sidebarEnabledAtom,
  themeAtom,
  viewModeAtom,
} from '@/app/providers/atoms';

describe('atoms', () => {
  it('exports themeAtom', () => {
    expect(themeAtom).toBeDefined();
  });

  it('exports backgroundOverlayAtom', () => {
    expect(backgroundOverlayAtom).toBeDefined();
  });

  it('exports sidebarEnabledAtom', () => {
    expect(sidebarEnabledAtom).toBeDefined();
  });

  it('exports backgroundOverlayOpacityAtom', () => {
    expect(backgroundOverlayOpacityAtom).toBeDefined();
  });

  it('exports greetingEnabledAtom', () => {
    expect(greetingEnabledAtom).toBeDefined();
  });

  it('exports greetingNameAtom', () => {
    expect(greetingNameAtom).toBeDefined();
  });

  it('exports viewModeAtom', () => {
    expect(viewModeAtom).toBeDefined();
  });
});
