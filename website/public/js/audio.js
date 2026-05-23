/**
 * Boojy Audio - Page JavaScript
 * Smart download detection, sparkle effect
 */

// ===================================
// Smart Download Section
// ===================================
const DOWNLOAD_CONFIG = {
    version: '0.1.0',
    versionDisplay: 'v0.1.0',
    releaseDate: 'Jan 2026',
    baseUrl: 'https://github.com/tyrbujac/boojy-audio/releases/latest/download/',
    releasesUrl: 'https://github.com/tyrbujac/boojy-audio/releases/latest',
    platforms: {
        'mac-arm64': {
            name: 'macOS',
            label: 'Silicon',
            file: 'Boojy-Audio-mac.dmg',
            icon: 'apple'
        },
        'mac-x64': {
            name: 'macOS',
            label: 'Intel',
            file: 'Boojy-Audio-mac.dmg',
            icon: 'apple'
        },
        'windows-x64': {
            name: 'Windows',
            label: 'Windows',
            file: 'Boojy-Audio-win.exe',
            icon: 'windows'
        },
        'windows-arm64': {
            name: 'Windows',
            label: 'Windows',
            file: 'Boojy-Audio-win.exe',
            icon: 'windows'
        }
    }
};


function initDownloadSection() {
    const downloadBtn = document.getElementById('download-btn');
    const downloadIcon = document.getElementById('download-icon');
    const detectedState = document.getElementById('download-detected');
    const fallbackState = document.getElementById('download-fallback');

    if (!downloadBtn) return;

    const detectedPlatform = detectPlatform();

    if (detectedPlatform && DOWNLOAD_CONFIG.platforms[detectedPlatform]) {
        const platform = DOWNLOAD_CONFIG.platforms[detectedPlatform];
        downloadBtn.href = DOWNLOAD_CONFIG.baseUrl + platform.file;
        downloadIcon.innerHTML = PLATFORM_ICONS[platform.icon];
        document.getElementById('download-text').textContent = 'Download';
        const platformLabel = document.getElementById('platform-label');
        if (platformLabel) platformLabel.textContent = platform.label;
        detectedState.style.display = 'block';
        fallbackState.style.display = 'none';
    } else {
        detectedState.style.display = 'none';
        fallbackState.style.display = 'block';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloadSection);
} else {
    initDownloadSection();
}

// ===================================
// Console Easter Egg
// ===================================
console.log('%c🎵 Boojy Audio 🎵', 'color: #38BDF8; font-size: 24px; font-weight: bold;');
console.log('%cMusic production without the barriers.', 'color: #5CCBFA; font-size: 16px;');
console.log('%cContribute: https://github.com/boojyorg', 'color: #6B7280; font-size: 12px;');
