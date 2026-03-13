const CONFIG = {
    POLL_INTERVAL: 1,
    ALARM_NAME: 'check-friend-requests',
    HOME_URL: 'https://spacehey.com/home'
};

chrome.runtime.onInstalled.addListener(() => {
    checkFriendRequests();
    
    chrome.alarms.clear(CONFIG.ALARM_NAME, () => {
        chrome.alarms.create(CONFIG.ALARM_NAME, { periodInMinutes: CONFIG.POLL_INTERVAL });
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === CONFIG.ALARM_NAME) {
        checkFriendRequests();
    }
});

async function checkFriendRequests() {
    try {
        const settings = await chrome.storage.sync.get(['friendNotifications']);
        const isEnabled = settings.friendNotifications !== undefined ? settings.friendNotifications : true;
        
        if (!isEnabled) {
            return;
        }

        const response = await fetch(CONFIG.HOME_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();

        const blockMatch = html.match(/<h4>Friend Requests<\/h4>[\s\S]*?<table class="comments-table"[^>]*>([\s\S]*?)<\/table>/);
        if (!blockMatch) {
            return;
        }

        const tableHtml = blockMatch[1];
        const rowRegex = /<tr>[\s\S]*?<a href="\/profile\?id=(\d+)">\s*<p>(.*?)<\/p>\s*<\/a>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>[\s\S]*?<b>Friend Request<\/b>[\s\S]*?<input type="hidden" name="request_id" value="(\d+)">[\s\S]*?<\/tr>/g;
        
        const currentRequests = [];
        let match;
        while ((match = rowRegex.exec(tableHtml)) !== null) {
            currentRequests.push({
                userId: match[1],
                name: match[2],
                image: match[3],
                requestId: match[4]
            });
        }

        if (currentRequests.length === 0) return;

        chrome.storage.local.get(['notifiedRequests'], (result) => {
            const notifiedRequests = result.notifiedRequests || [];
            const newRequests = currentRequests.filter(req => !notifiedRequests.includes(req.requestId));

            if (newRequests.length > 0) {
                newRequests.forEach(req => {
                    notify(req);
                });

                const updatedNotified = [...notifiedRequests, ...newRequests.map(req => req.requestId)];
                if (updatedNotified.length > 100) {
                    updatedNotified.splice(0, updatedNotified.length - 100);
                }
                chrome.storage.local.set({ notifiedRequests: updatedNotified });
            }
        });

    } catch (error) {
        console.error('[SpaceHeyMods] Error checking friend requests:', error);
    }
}

function notify(request) {
    let iconUrl = request.image;
    if (iconUrl && !iconUrl.startsWith('http')) {
        iconUrl = 'https://spacehey.com' + (iconUrl.startsWith('/') ? '' : '/') + iconUrl;
    }

    chrome.notifications.create(`friend-request-${request.requestId}`, {
        type: 'basic',
        iconUrl: iconUrl || 'https://spacehey.com/favicon.ico',
        title: 'New Friend Request',
        message: `${request.name} sent you a friend request!`,
        contextMessage: 'SpaceHeyMods',
        priority: 2
    });
}
