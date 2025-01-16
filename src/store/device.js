import { defineStore } from 'pinia';

export const useDeviceStore = defineStore('device', {
    state: () => ({
        deviceType: null,
    }),
    actions: {
        detectDevice() {
            const platform = navigator.platform || 'unknown';
            const userAgent = navigator.userAgent || '';
            
            // Rilevamento specifico per Android
            if (/android/i.test(userAgent)) {
                this.deviceType = 'android';
            }
            // Rilevamento per iOS (iPad, iPhone)
            else if (/iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
                this.deviceType = 'ios-phone';
            }
            // Rilevamento per PC (Mac o Windows senza touch)
            else if (/Macintosh|Windows/i.test(platform) && navigator.maxTouchPoints === 0) {
                this.deviceType = 'pc';
            }
            // Rilevamento fallback
            else {
                this.deviceType = 'unknown';
            }
        },
    },
});
