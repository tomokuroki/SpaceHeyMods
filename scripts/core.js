(function() {
    'use strict';
    
    const config = window.SpaceHeyMods?.featuresConfig || [];
    const logicMap = window.SpaceHeyMods?.featuresLogic || {};
    
    const featureIds = config.map(f => f.id);
    
    browser.storage.sync.get(featureIds, (result) => {
        config.forEach(feature => {
            const isEnabled = result[feature.id] !== undefined ? result[feature.id] : feature.defaultEnabled;
            
            if (!isEnabled) return;
            
            let hostAllowed = true;
            if (feature.hostMatches && feature.hostMatches.length > 0) {
                hostAllowed = feature.hostMatches.some(host => window.location.hostname.includes(host) || host === '*');
            }
            
            if (hostAllowed && typeof logicMap[feature.id] === 'function') {
                try {
                    logicMap[feature.id]();
                    console.log(`[SpaceHeyMods] Feature loaded: ${feature.name}`);
                } catch (err) {
                    console.error(`[SpaceHeyMods] Error loading feature ${feature.id}:`, err);
                }
            }
        });
    });
})();
