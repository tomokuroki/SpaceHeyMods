/**
 * SpaceHeyMods Browser API Compatibility Layer
 * Standardizes access to extension APIs across Chrome, Firefox, Safari, and Edge.
 */

if (typeof browser === "undefined") {
    if (typeof chrome !== "undefined") {
        globalThis.browser = chrome;
    } else if (typeof self !== "undefined" && typeof self.chrome !== "undefined") {
        globalThis.browser = self.chrome;
    } else {
        console.error("[SpaceHeyMods] No browser extension API detected.");
    }
}

// Add Promise support for older Chrome APIs if needed
// Modern Chrome MV3 already supports promises for most calls if no callback is provided.
// But some might still need normalization.
