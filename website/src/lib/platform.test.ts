import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectPlatform, isMobileDevice } from './platform';

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  // iPadOS Safari asks for the desktop site by default: a Mac UA, given away by touch points.
  ipad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36',
  linux:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  linuxArm:
    'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  windows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
};

/** Fake the browser globals detectPlatform reads. WebGL is unavailable (getContext → null). */
function stubBrowser(userAgent: string, platform: string, maxTouchPoints = 0) {
  vi.stubGlobal('navigator', { userAgent, platform, maxTouchPoints });
  vi.stubGlobal('document', { createElement: () => ({ getContext: () => null }) });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('isMobileDevice / detectPlatform', () => {
  it('treats an iPhone as mobile, never as a Mac', () => {
    stubBrowser(UA.iphone, 'iPhone');
    expect(isMobileDevice()).toBe(true);
    expect(detectPlatform()).toBeNull();
  });

  it('treats an iPad requesting the desktop site as mobile', () => {
    stubBrowser(UA.ipad, 'MacIntel', 5);
    expect(isMobileDevice()).toBe(true);
    expect(detectPlatform()).toBeNull();
  });

  it('treats an Android phone as mobile, never as Linux', () => {
    stubBrowser(UA.android, 'Linux armv8l');
    expect(isMobileDevice()).toBe(true);
    expect(detectPlatform()).toBeNull();
  });

  it('detects desktop Linux on x64 and on ARM', () => {
    stubBrowser(UA.linux, 'Linux x86_64');
    expect(detectPlatform()).toBe('linux');
    stubBrowser(UA.linuxArm, 'Linux aarch64');
    expect(detectPlatform()).toBe('linux-arm64');
  });

  it('detects Windows', () => {
    stubBrowser(UA.windows, 'Win32');
    expect(detectPlatform()).toBe('windows-x64');
  });

  it('keeps a real Mac (no touch points) on the desktop path', () => {
    stubBrowser(UA.ipad, 'MacIntel', 0);
    expect(isMobileDevice()).toBe(false);
    expect(detectPlatform()).toBe('mac-x64'); // no WebGL renderer to prove Apple Silicon
  });
});
