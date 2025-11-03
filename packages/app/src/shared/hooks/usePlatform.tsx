import { useMemo } from 'react';

export interface PlatformInfo {
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
}

/**
 * Hook to detect the current platform/OS
 * Useful for displaying platform-specific keyboard shortcuts and UI elements
 */
export function usePlatform(): PlatformInfo {
  return useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        isMac: false,
        isWindows: false,
        isLinux: false,
        isMobile: false,
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    // Use userAgentData if available (modern browsers), otherwise fall back to userAgent
    const platform =
      (
        navigator as typeof navigator & { userAgentData?: { platform?: string } }
      ).userAgentData?.platform?.toLowerCase() || userAgent;

    const isMac = /mac/.test(platform) || /mac/.test(userAgent);
    const isWindows = /win/.test(platform) || /windows/.test(userAgent);
    const isLinux = /linux/.test(platform) && !/android/.test(userAgent);

    return {
      isMac,
      isWindows,
      isLinux,
    };
  }, []);
}

/**
 * Hook to get the platform-specific modifier key name
 * Returns "⌘" for Mac, "Ctrl" for Windows/Linux
 */
export function useModifierKey(): string {
  const { isMac } = usePlatform();
  return useMemo(() => (isMac ? '⌘' : 'Ctrl'), [isMac]);
}
